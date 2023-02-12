const URL = process.env.NEXT_PUBLIC_URL_API;

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";

import { Spinner } from "@/components/Spinner";
import { findColorOrRandom } from "@/styles/colors";
import { Pokemon } from "@/types/Pokemon";

export default function SpecificPokemon() {
  const [pokemon, setPokemon] = useState<Pokemon>();
  const { query } = useRouter();

  useEffect(() => {
    const { id, search } = query;
    if (id || search) {
      (async () => {
        const response = await fetch(`${URL}/pokemon/${search ? search : id}`);
        const pokemons = (await response.json()) as Pokemon;

        setPokemon(pokemons);
      })();
    }
  }, [query]);

  const typeNames = pokemon?.types.map(({ type }) => type.name);

  const linearGradient = `linear-gradient(to right, #403a3e, ${
    typeNames ? `${findColorOrRandom(typeNames?.[0])}` : "#f4f4f4"
  })`;

  return (
    <main
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: linearGradient,
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
        <div
          style={{
            position: "absolute",
            top: "364px",
            left: "93px",
            display: "inline-flex",
            gap: "5px",
            alignItems: "center",
          }}
        >
          <p>#{pokemon?.id}</p>
          <h5>{pokemon?.name}</h5>
        </div>
        <Image
          width={425}
          height={637}
          src="/pokedex.png"
          alt="pokedex"
          priority
        />
        <div
          style={{
            position: "absolute",
            display: "flex",
            flexWrap: "wrap",
            gap: "10px",
            bottom: "41px",
            left: "32px",
            padding: "9px",
            borderRadius: "6px",
            maxWidth: "315px",
            opacity: 0.8,
          }}
        >
          {pokemon ? (
            <>
              {pokemon?.stats.map(({ stat, base_stat }) => (
                <div
                  key={stat.name}
                  style={{ display: "inline-flex", gap: "10px" }}
                >
                  <p
                    style={{
                      color: "white",
                      fontSize: "17px",
                      fontWeight: "bold",
                      textTransform: "capitalize",
                    }}
                  >
                    {stat.name}
                  </p>
                  <progress id="stats" value={base_stat} max="100" />
                </div>
              ))}
            </>
          ) : (
            <>
              <Spinner />
            </>
          )}
        </div>
      </div>
    </main>
  );
}
