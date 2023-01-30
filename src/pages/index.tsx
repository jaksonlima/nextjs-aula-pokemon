// import { hexa } from "@/utils/randomColor";
// import { GetServerSidePropsContext } from "next";
// import { useRouter } from "next/router";
// import { UIEvent, useEffect, useState } from "react";

// export default function Pokemon({ data }: any) {
//   const { query, push, pathname } = useRouter();
//   const [pokemon, setPokemon] = useState<any[]>([]);

//   const offsetBuild = Number(query?.offset);

//   useEffect(() => {
//     if (pokemon.length === offsetBuild) {
//       setPokemon(pokemon.concat(data));
//     }
//   }, [data]);

//   useEffect(() => {
//     if (pokemon.length !== offsetBuild) {
//       handlePaginationBuild();
//     }
//   }, []);

//   const handlePaginationBuild = () => {
//     push({
//       pathname,
//       query: {
//         offset: 0,
//       },
//     });
//   };

//   const handlePaginationPrevius = () => {
//     query.offset = `${offsetBuild + 5}`;

//     push({
//       pathname,
//       query: query,
//     });
//   };

//   const handleScroll = (
//     event: UIEvent<HTMLUListElement, globalThis.UIEvent>
//   ) => {
//     const { offsetHeight, scrollTop, scrollHeight } = event.currentTarget;

//     const validate = offsetHeight + scrollTop >= scrollHeight;

//     if (validate) {
//       handlePaginationPrevius();
//       return validate;
//     }

//     return validate;
//   };

//   return (
//     <>
//       <ul
//         style={{
//           overflowX: "auto",
//           display: "flex",
//           flexWrap: "wrap",
//           margin: "10px",
//         }}
//         onScroll={handleScroll}
//       >
//         {pokemon?.map((poke) => (
//           <li
//             key={poke?.url + poke?.name}
//             style={{
//               height: "141px",
//               width: "250px",
//               margin: "8px",
//               padding: "5px",
//               borderRadius: "20px",
//               border: "1px solid #80808073",
//               borderLeftColor: `${hexa()}`,
//               borderLeftWidth: "12px",
//               lightingColor: "red",
//               filter: "brightness(100%)",
//               position: "relative",
//               backgroundColor: "#e9e9e96e",
//             }}
//           >
//             <h4>{poke?.name}</h4>
//             <img
//               style={{
//                 width: "100px",
//                 height: "100px",
//                 position: "absolute",
//                 right: "28px",
//                 top: "12px",
//               }}
//               src={poke.versionsFrontDefault}
//               alt="front_default"
//             />
//           </li>
//         ))}
//       </ul>
//     </>
//   );
// }

// export async function getServerSideProps({ query }: GetServerSidePropsContext) {
//   const offset = Number(query?.offset);

//   const responsePokemonAll = async () => {
//     const response = await fetch(
//       `https://pokeapi.co/api/v2/pokemon?limit=40&offset=${offset}`
//     );

//     return await response.json();
//   };

//   const responsePokemonByUrl = async (pokemon: any) => {
//     const { name, url } = pokemon;

//     const response = await fetch(url);
//     const { id, types, sprites } = await response.json();

//     return {
//       name,
//       id,
//       types,
//       spritesFrontDefault: sprites.other?.["official-artwork"].front_default,
//       versionsFrontDefault:
//         sprites.versions?.["generation-v"]?.["black-white"].animated
//           .front_default,
//     };
//   };

//   const pokemonAll = await responsePokemonAll();

//   const pokemonAllSpecific = await Promise.all(
//     pokemonAll.results?.map(responsePokemonByUrl)
//   );

//   return {
//     props: { data: pokemonAllSpecific },
//   };
// }

import { GetServerSideProps } from "next/types";

export default function Index() {
  return <div>Carregando...</div>;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    redirect: {
      destination: "/react/pokemon",
      permanent: true,
    },
  };
};
