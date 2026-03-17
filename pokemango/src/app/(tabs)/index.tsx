import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { Image, ScrollView, Text, View, StyleSheet } from "react-native";
import colorsByType from "../../shared/types/color-by-type";

interface Pokemon {
  name: string;
  image: string;
  imageBack: string;
  types: PokemonType[];
}

interface PokemonType {
  type: {
    name: string;
    url: string;
  }
}

export default function Index() {

  const [pokemon, setPokemon] = useState<Pokemon[]>([]);

  console.log(JSON.stringify(pokemon, null, 2))

  useEffect(() => {
    // fetch pokemon from api
    fetchPokemon();
  }, [])

  const fetchPokemon = async (): Promise<void> => {
    try {
      const response = await fetch("https://pokeapi.co/api/v2/pokemon/?limit=20");
      const data = await response.json();

      const detailedPokemons = await Promise.all(
        data.results.map(async (pokemon: any) => {
          const res = await fetch(pokemon.url);
          const details = await res.json();
          return {
            name: pokemon.name,
            image: details.sprites.front_default,
            imageBack: details.sprites.back_default,
            types: details.types
          }
        })
      )
      setPokemon(detailedPokemons);
    } catch (e) {
      console.log('ERROR', e)
    }
  }

  return (
    <ScrollView contentContainerStyle={{
      gap: 16,
      padding: 16
    }}>
      { pokemon.map((pm) => (
        <Link key={pm.name}
          href={{ pathname: "/details", params: {
            name: pm.name
          } }}
          style={{
            // @ts-ignore
            backgroundColor: colorsByType[pm.types[0].type.name] + 60,
            padding: 20,
            borderRadius: 20
          }}
        >
          <View>
            <Text style={styles.name}>{ pm.name }</Text>
            <Text style={styles.type}>{ pm.types[0].type.name }</Text>

            <View style={{ flexDirection: "row" }}>
              <Image 
                source={{ uri: pm.image }}
                style={{ width: 150, height: 150 }}
              />
              <Image 
                source={{ uri: pm.imageBack }}
                style={{ width: 150, height: 150 }}
              />
            </View>

          </View>
        </Link>
      ))}
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  type: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'gray',
    textAlign: 'center'
  },
})