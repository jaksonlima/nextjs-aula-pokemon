const URL = process.env.NEXT_PUBLIC_URL_API;

import Image from "next/image";
import { useEffect, useState } from "react";

import css from "@/styles/Pokemon.module.css";
import { findColorOrRandom } from "@/styles/colors";
import { AllPokemon, Pokemon } from "@/types/Pokemon";
import Link from "next/link";

export default function IndexPokemon() {
  const [pokemons, setPokemon] = useState<Pokemon[]>();

  useEffect(() => {
    (async () => {
      const response = await fetch(`${URL}/pokemon/?offset=0&limit=50`);
      const pokemons = (await response.json()) as AllPokemon;

      const allFetch = pokemons.results.map((pokemon) =>
        fetch(pokemon.url).then<Pokemon>((response) => response.json())
      );
      const pokemosSpecific = await Promise.all(allFetch);

      setPokemon(pokemosSpecific);

      console.log({ pokemosSpecific });
    })();
  }, []);

  return (
    <>
      <ul className={css.container} style={{ margin: "15px" }}>
        {pokemons?.map((pokemon) => {
          const typeNames = pokemon.types.map(({ type }) => type.name);

          return (
            <li
              className={`${css.item} ${css.shadowdropcenter}`}
              style={{
                background: `linear-gradient(to right, #403a3e, ${findColorOrRandom(
                  typeNames[0]
                )})`,
              }}
            >
              <Link href={`/react/pokemon/${pokemon.id}`}>
                <Image
                  className={css.slideFwdTop}
                  width={250}
                  height={250}
                  src={
                    pokemon?.sprites.other?.["official-artwork"]
                      .front_default || ""
                  }
                  alt="pokemon-image"
                />
                <footer className={css.footer}>
                  <p className={css.id}>#{pokemon.id}</p>
                  <h5 className={css.name}>{pokemon.name}</h5>
                  <div className={css.containerType}>
                    {typeNames.map((typeName) => (
                      <p
                        className={css.types}
                        style={{
                          backgroundColor: findColorOrRandom(typeName),
                        }}
                      >
                        {typeName}
                      </p>
                    ))}
                  </div>
                </footer>
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}
