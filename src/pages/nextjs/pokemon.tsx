import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { findColorOrRandom } from "@/styles/colors";
import css from "@/styles/Pokemon.module.css";

export default function Pokemon({ data }: any) {
  const { query, push, pathname } = useRouter();
  const [pokemons, setPokemon] = useState<any[]>([]);

  const offsetBuild = Number(query?.offset);

  useEffect(() => {
    if (pokemons.length === offsetBuild) {
      setPokemon(pokemons.concat(data));
    }
  }, [data]);

  useEffect(() => {
    if (pokemons.length !== offsetBuild) {
      handlePaginationBuild();
    }
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handlePaginationBuild = () => {
    push({
      pathname,
      query: {
        offset: 0,
      },
    });
  };

  const handlePaginationPrevius = () => {
    query.offset = `${offsetBuild + 5}`;

    push({
      pathname,
      query: query,
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
  const offset = Number(query?.offset);

  const responsePokemonAll = async () => {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon?limit=40&offset=${offset}`
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
