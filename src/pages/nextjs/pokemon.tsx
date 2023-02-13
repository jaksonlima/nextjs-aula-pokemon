import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { findColorOrRandom } from "@/styles/colors";
import css from "@/styles/Pokemon.module.css";

const limit = 20;
const offset = 0;

export default function Pokemon({ data }: any) {
  const { query, pathname, replace } = useRouter();
  const [pokemons, setPokemon] = useState<any[]>([]);

  console.log({ data });

  useEffect(() => {
    if (query.offset && !query.search) {
      setPokemon((oldPokemons) => {
        const filter = data.filter(
          (pokemoSpecific: any) =>
            !oldPokemons.some(
              (oldPokemon) => pokemoSpecific.id === oldPokemon?.id
            )
        );

        return oldPokemons.concat(filter);
      });
    }

    if (query.search) {
      (async () => {
        const pokemonExistsIndex = pokemons.findIndex(
          (pokemon: any) =>
            `${pokemon.id}` === `${query.search}` ||
            pokemon.name === query.search
        );

        if (pokemonExistsIndex >= 0) {
          const pokemonSelectedIndex = pokemons[pokemonExistsIndex];
          const pokemonSelectedIndexZero = pokemons[0];

          pokemons[0] = pokemonSelectedIndex;
          pokemons[pokemonExistsIndex] = pokemonSelectedIndexZero;

          setPokemon([...pokemons]);
        }
      })();
    }
  }, [data]);

  useEffect(() => {
    handlePaginationBuild();
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handlePaginationBuild = () => {
    replace({
      pathname,
      query: {
        offset,
      },
    });
  };

  const handlePaginationPrevius = () => {
    query.search = "";
    query.offset = `${parseFloat((query.offset as string) ?? offset) + limit}`;

    replace({
      pathname,
      query,
    });
  };

  const handleScroll = () => {
    const validate =
      Math.ceil(window.innerHeight + window.scrollY) >=
      document.documentElement.scrollHeight;

    if (validate) {
      handlePaginationPrevius();
      return validate;
    }

    return validate;
  };

  return (
    <>
      <ul className={css.container} style={{ margin: "15px" }}>
        {pokemons.map((pokemon) => {
          const typeNames = pokemon?.types.map(({ type }: any) => type.name);

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
              <Link href={`/nextjs/pokemon/${pokemon.id}`}>
                <Image
                  priority
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
                    {typeNames.map((typeName: any) => (
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

export async function getServerSideProps({ query }: GetServerSidePropsContext) {
  const search = query?.search;

  if (search) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${search}`);

    const { id, name, sprites, types } = await response.json();

    return {
      props: { data: [{ id, name, sprites, types }] },
    };
  }

  const offset = Number(query?.offset);

  const responsePokemonAll = async () => {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`
    );

    return await response.json();
  };

  const responsePokemonByUrl = async (pokemon: any) => {
    const { url } = pokemon;

    const response = await fetch(url);
    const { id, name, sprites, types } = await response.json();

    return {
      id,
      name,
      sprites,
      types,
    };
  };

  const pokemonAll = await responsePokemonAll();

  const pokemonAllSpecific = await Promise.all(
    pokemonAll.results?.map(responsePokemonByUrl)
  );

  return {
    props: { data: pokemonAllSpecific },
  };
}
