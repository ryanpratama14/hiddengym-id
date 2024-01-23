"use client";

import { REFETCH_INTERVAL, USER_REDIRECT } from "@/lib/constants";
import { closeModal, createUrl } from "@/lib/functions";
import { schema } from "@/schema";
import { api } from "@/trpc/react";
import type { Dictionary, Lang, SearchParams } from "@/types";
import { useRouter } from "next/navigation";
import { Fragment } from "react";
import ProductsList from "./List";
import ModalUpdate from "./ModalUpdate";

type Props = { lang: Lang; searchParams: SearchParams; t: Dictionary };

export default function ProductsContainer({ lang, searchParams, t }: Props) {
  const router = useRouter();
  const query = schema.product.list.parse(searchParams);
  const newParams = new URLSearchParams(searchParams);
  const { data, isLoading: loading } = api.product.list.useQuery(query, { refetchInterval: REFETCH_INTERVAL });

  const redirect = (newParams: URLSearchParams) => {
    router.push(createUrl(USER_REDIRECT({ lang, href: "/products", role: "OWNER" }), newParams));
  };

  return (
    <Fragment>
      <section className="flex flex-col gap-6">
        <section className="grid grid-cols-4 gap-4">
          <ModalUpdate
            t={t}
            data={searchParams.id && searchParams.update && data ? data.find((e) => e.id === searchParams.id)! : null}
            show={!!searchParams.id && !!searchParams.update}
            closeModal={closeModal({ action: "update", newParams, redirect })}
          />
          <ProductsList newParams={newParams} redirect={redirect} data={data} loading={loading} searchParams={searchParams} />
        </section>
      </section>
    </Fragment>
  );
}
