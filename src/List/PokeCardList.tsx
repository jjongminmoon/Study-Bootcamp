import styled from "@emotion/styled";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../Store";
import { fetchPokemons } from "../Store/PokemonSlice";
import useInfiniteScroll from "react-infinite-scroll-hook";
import PokeCard from "./PokeCard";

export default function PokeCardList() {
  const dispatch = useAppDispatch();
  const { pokemons } = useSelector((state: RootState) => state.pokemons);

  const [infiniteRef] = useInfiniteScroll({
    loading: false,
    hasNextPage: pokemons.next !== "",
    onLoadMore: async () => {
      dispatch(fetchPokemons(pokemons.next));
    },
    disabled: false,
    rootMargin: "0px 0px 400px 0px"
  });

  useEffect(() => {
    dispatch(fetchPokemons());
  }, [dispatch]);

  return (
    <>
      <List>
        {pokemons.results.map((pokemon, index) => (
          <PokeCard key={`${pokemon.name}_${index}`} name={pokemon.name} />
        ))}
      </List>
      <Loading ref={infiniteRef}>Loading...</Loading>
    </>
  );
}

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 32px 0;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
`;

const Loading = styled.div`
  display: flex;
  justify-content: center;
`;
