import type { NextPageContext } from "next";
import Error, { ErrorProps } from "next/error";

const CustomErrorComponent = (props: ErrorProps) => {
  return <Error statusCode={props.statusCode} />;
};

CustomErrorComponent.getInitialProps = async (contextData: NextPageContext) => {
  try {
    const Sentry = await import("@sentry/nextjs");
    await Sentry.captureUnderscoreErrorException(contextData);
  } catch {
    // Sentry not available
  }

  return Error.getInitialProps(contextData);
};

export default CustomErrorComponent;
