import Image from "next/image";
import { useRouter } from "next/router";
import React, { PropsWithChildren } from "react";

function debounce<T = any>(func: (props: T) => void, wait: number) {
  let timer: number | undefined;
  return function (props: T) {
    clearTimeout(timer);
    timer = setTimeout(() => func(props), wait) as any;
  };
}

export default function Nav({ children }: PropsWithChildren) {
  const { replace, asPath, push, query } = useRouter();

  function onChangeReplace(event: React.ChangeEvent<HTMLInputElement>) {
    const valueSearch = event.target.value;

    replace({
      pathname: asPath?.split("?")?.[0],
      ...(valueSearch && { search: `search=${event.target.value}` }),
    });
  }

  const onClickPush = () => {
    push("/react/pokemon");
  };

  return (
    <>
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: "0",
          minHeight: "80px",
          backgroundColor: "rgb(64 58 62 / 93%)",
          padding: "10px",
          zIndex: "2000",
        }}
      >
        <div
          style={{
            cursor: "pointer",
          }}
          onClick={onClickPush}
        >
          <Image src="/pokebola.png" alt="pokebola" width={60} height={60} />
        </div>
        <input
          type="search"
          name="search"
          id="search"
          placeholder="Pesquisar por nome ou id"
          onChange={debounce<React.ChangeEvent<HTMLInputElement>>(
            onChangeReplace,
            700
          )}
          style={{
            padding: "6px",
            borderRadius: "2px",
            fontSize: "17px",
            border: "none",
          }}
        />
      </nav>
      {children}
    </>
  );
}
