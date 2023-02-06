const URL = process.env.NEXT_PUBLIC_URL_API;

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { findColorOrRandom } from "@/styles/colors";
import { AllPokemon, Pokemon } from "@/types/Pokemon";
import { useRouter } from "next/router";
import css from "@/styles/Pokemon.module.css";

export default function IndexPokemon() {
  const {
    query: { search },
  } = useRouter();
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [offset, setOffset] = useState<number>(0);
  const [offsetOld, setOffsetoffsetOld] = useState<number>();
  const limit = 15;

  useEffect(() => {
    if (!search || offsetOld !== offset) {
      (async () => {
        const response = await fetch(
          `${URL}/pokemon/?offset=${offset}&limit=${limit}`
        );

        const pokemons = (await response.json()) as AllPokemon;

        const allFetch = pokemons.results.map((pokemon) =>
          fetch(pokemon.url).then<Pokemon>((response) => response.json())
        );

        const pokemosSpecific = await Promise.all(allFetch);

        setPokemons((oldPokemons) => {
          const data = pokemosSpecific.filter(
            (pokemoSpecific) =>
              !oldPokemons.some(
                (oldPokemon) => pokemoSpecific.id === oldPokemon?.id
              )
          );

          return oldPokemons.concat(data);
        });

        setOffsetoffsetOld(offset);
      })();
    }

    if (search) {
      (async () => {
        const pokemonExistsIndex = pokemons.findIndex(
          (pokemon: Pokemon) =>
            `${pokemon.id}` === `${search}` || pokemon.name === search
        );

        if (pokemonExistsIndex >= 0) {
          const pokemonSelectedIndex = pokemons[pokemonExistsIndex];
          const pokemonSelectedIndexZero = pokemons[0];

          pokemons[0] = pokemonSelectedIndex;
          pokemons[pokemonExistsIndex] = pokemonSelectedIndexZero;

          setPokemons([...pokemons]);
        } else {
          const response = await fetch(`${URL}/pokemon/${search}`);

          const pokemonSearch = (await response.json()) as Pokemon;

          setPokemons((oldPokemon) => [pokemonSearch].concat(oldPokemon));
        }
      })();
    }
  }, [search, offset]);

  useEffect(() => {
    const handleScroll = () => {
      const bottom =
        Math.ceil(window.innerHeight + window.scrollY) >=
        document.documentElement.scrollHeight;

      if (bottom) {
        setOffset((oldOffset) => oldOffset + limit);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <ul className={css.container} style={{ margin: "15px" }}>
        {pokemons.map((pokemon) => {
          const typeNames = pokemon?.types.map(({ type }) => type.name);

          const linearGradient = `linear-gradient(to right, #403a3e, ${
            typeNames ? `${findColorOrRandom(typeNames?.[0])}` : "#f4f4f4"
          })`;

          return (
            <li
              key={pokemon.id}
              className={`${css.item} ${css.shadowdropcenter}`}
              style={{
                background: linearGradient,
              }}
            >
              <Link href={`/react/pokemon/${pokemon.id}`}>
                <Image
                  className={css.slideFwdTop}
                  width={250}
                  height={250}
                  alt="pokemon-image"
                  src={
                    pokemon?.sprites.other?.["official-artwork"]
                      .front_default || ""
                  }
                />
                <footer className={css.footer}>
                  <p className={css.id}>#{pokemon.id}</p>
                  <h5 className={css.name}>{pokemon.name}</h5>
                  <div className={css.containerType}>
                    {typeNames.map((typeName) => (
                      <p
                        key={`${pokemon.id}-${typeName}`}
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
