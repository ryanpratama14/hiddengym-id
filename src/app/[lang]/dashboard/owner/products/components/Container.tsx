"use client";

import { REFETCH_INTERVAL, USER_REDIRECT } from "@/lib/constants";
import { createUrl } from "@/lib/functions";
import { schema } from "@/schema";
import { api } from "@/trpc/react";
import { type Dictionary, type Lang, type SearchParams } from "@/types";
import { useRouter } from "next/navigation";
import { Fragment } from "react";
import ProductsList from "./List";

type Props = { lang: Lang; searchParams: SearchParams; t: Dictionary };

export default function ProductsContainer({ lang, searchParams, t }: Props) {
  const router = useRouter();
  const query = schema.product.list.parse(searchParams);
  const newParams = new URLSearchParams(searchParams);
  const { data, isLoading: loading } = api.product.list.useQuery(query, { refetchInterval: REFETCH_INTERVAL });

  const redirectTable = (newParams: URLSearchParams) => {
    router.push(createUrl(USER_REDIRECT.OWNER({ lang, href: "/products" }), newParams));
  };

  return (
    <Fragment>
      <ProductsList
        data={data}
        loading={loading}
        redirectTable={redirectTable}
        newParams={newParams}
        t={t}
        searchParams={searchParams}
      />
    </Fragment>
  );
}
