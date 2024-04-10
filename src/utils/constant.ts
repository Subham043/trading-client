import { MantineThemeOverride, rem } from "@mantine/core";
import { QueryClientConfig } from "@tanstack/react-query";

export const QueryClientOptions: QueryClientConfig = {
  defaultOptions: {
    queries: {
      // With SSR, we usually want to set some default staleTime
      // above 0 to avoid refetching immediately on the client
      // see https://tanstack.com/query/v4/docs/guides/ssr#react
      staleTime: undefined,
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: false,
      refetchInterval: false,
      retry: 2,
      retryDelay: 3000,
    },
  },
};

export const QueryInitialPageParam = 1;

export const QueryTotalCount = 20;

export const mantineThemOptions: MantineThemeOverride = {
  /** Put your mantine theme override here */
  fontFamily: "Open Sans, sans-serif",
  primaryColor: "blue",

  shadows: {
    md: "1px 1px 3px rgba(0, 0, 0, .25)",
    xl: "5px 5px 3px rgba(0, 0, 0, .25)",
  },

  headings: {
    fontFamily: "Roboto, sans-serif",
    sizes: {
      h1: { fontSize: rem(36) },
    },
  },
};
