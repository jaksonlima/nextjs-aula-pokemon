const URL = process.env.NEXT_PUBLIC_URL_API;

import { Spinner } from "@/components/Spinner";
import { findColorOrRandom } from "@/styles/colors";
import { Pokemon } from "@/types/Pokemon";
import Image from "next/image";
import { useRouter } from "next/router";
import { PropsWithChildren, useEffect, useState } from "react";

function SpecificPokemonImage({ children }: PropsWithChildren) {
  return (
    <div style={{ position: "absolute", top: "207px", left: "156px" }}>
      {children}
    </div>
  );
}

export default function SpecificPokemon() {
  const [pokemon, setPokemon] = useState<Pokemon>();

  const { query } = useRouter();

  useEffect(() => {
    const id = query.id;
    if (query.id) {
      (async () => {
        const response = await fetch(`${URL}/pokemon/${id}`);
        const pokemons = (await response.json()) as Pokemon;

        setPokemon(pokemons);

        console.log({ pokemons });
      })();
    }
  }, [query]);

  const typeNames = pokemon?.types.map(({ type }) => type.name);

  return (
    <main
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: `linear-gradient(to right, #403a3e, ${findColorOrRandom(
          typeNames?.[0] || ""
        )})`,
      }}
    >
      <div style={{ position: "relative" }}>
        <div style={{ position: "absolute", top: "207px", left: "156px" }}>
          {pokemon ? (
            <Image
              width={90}
              height={91}
              src={
                pokemon?.sprites?.versions?.["generation-v"]?.["black-white"]
                  ?.animated?.front_default || ""
              }
              alt="pokedex"
            />
          ) : (
            <Spinner />
          )}
        </div>
        <Image width={425} height={637} src="/pokedex.png" alt="pokedex" />;
      </div>
    </main>
  );
}
