"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface ContributorAvatarProps {
  username: string;
}

export function ContributorAvatar({ username }: ContributorAvatarProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return null;
  }

  return (
    <Link
      href={`https://github.com/${username}`}
      target="_blank"
      rel="noopener noreferrer"
      title={`@${username}`}
    >
      <Image
        src={`https://github.com/${username}.png`}
        alt=""
        width={32}
        height={32}
        className="hover:ring-primary h-8 w-8 rounded-full transition-all hover:ring-2"
        onError={() => setHasError(true)}
      />
    </Link>
  );
}
