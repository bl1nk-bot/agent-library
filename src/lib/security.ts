import { lookup } from 'dns/promises';
import { isIP } from 'net';

/**
 * Checks if an IP address is private, loopback, or otherwise restricted.
 */
function isPrivateIP(ip: string): boolean {
  // Check for IPv4 private ranges
  // 10.0.0.0/8      -> 10.x.x.x
  // 172.16.0.0/12   -> 172.16.x.x - 172.31.x.x
  // 192.168.0.0/16  -> 192.168.x.x
  // 127.0.0.0/8     -> 127.x.x.x (Loopback)
  // 169.254.0.0/16  -> 169.254.x.x (Link-local)
  // 0.0.0.0/8       -> 0.x.x.x (Current network)
  
  if (ip === '::1') return true; // IPv6 loopback
  if (ip.startsWith('fe80:')) return true; // IPv6 link-local
  if (ip.startsWith('fc') || ip.startsWith('fd')) return true; // IPv6 private unique local

  const parts = ip.split('.').map(Number);
  if (parts.length !== 4) return false; // Not IPv4 (or invalid format handled by isIP check before)

  if (parts[0] === 10) return true;
  if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true;
  if (parts[0] === 192 && parts[1] === 168) return true;
  if (parts[0] === 127) return true;
  if (parts[0] === 169 && parts[1] === 254) return true;
  if (parts[0] === 0) return true;

  return false;
}

/**
 * Validates a URL for SSRF vulnerabilities.
 * Throws an error if the URL is invalid or resolves to a restricted IP.
 */
export async function validateUrl(url: string): Promise<void> {
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(url);
  } catch {
    throw new Error('Invalid URL format');
  }

  if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
    throw new Error('Invalid protocol. Only http and https are allowed.');
  }

  // Resolve hostname
  const hostname = parsedUrl.hostname;
  
  // Skip DNS lookup if hostname is an IP literal and check directly
  if (isIP(hostname)) {
      if (isPrivateIP(hostname)) {
          throw new Error(`Access to restricted IP address ${hostname} is forbidden.`);
      }
      return;
  }

  try {
    const { address } = await lookup(hostname);
    if (isPrivateIP(address)) {
      throw new Error(`Access to restricted IP address ${address} (resolved from ${hostname}) is forbidden.`);
    }
  } catch (error) {
     if (error instanceof Error && error.message.includes('Access to restricted IP')) {
         throw error;
     }
    // If DNS lookup fails, strictly we should fail for security in high-security contexts.
    // However, sometimes public DNS fails. But allowing it means we might miss a private DNS resolution if the attacker controls DNS.
    // For this context (SSRF prevention), if we can't resolve it to check the IP, we shouldn't let fetch try blindly.
    throw new Error(`Failed to resolve hostname: ${hostname}`);
  }
}
