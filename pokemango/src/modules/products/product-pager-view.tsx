import {
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import { Pokemon } from "../../shared/types/pokemon.interface";
import colorsByType from "../../shared/types/color-by-type";
import SingleProduct from "./single-product";
import { shuffle } from "@/src/shared/lib/functions";
import { useTabTheme } from "@/src/shared/context/tab-theme-context";
import { useEffect, useMemo, useState } from "react";
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
} from "react-native-reanimated";

interface Props {
  pokemonList: Pokemon[];
}

const PagerView = ({ pokemonList }: Props) => {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const { setTabColor } = useTabTheme();
  const [activeIndex, setActiveIndex] = useState(0);

  const randomPokemon: Pokemon[] = useMemo<Pokemon[]>(
    () => shuffle(pokemonList),
    [pokemonList],
  );

  const applyColorByIndex = (index: number) => {
    if (!randomPokemon.length) return;
    const safeIndex = Math.max(0, Math.min(index, randomPokemon.length - 1));
    const typeName = randomPokemon[safeIndex]?.types?.[0]?.type?.name;
    const color = colorsByType[typeName] ?? "#7619ec";
    setTabColor(color);
  };

  const handlePageChange = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = event.nativeEvent.contentOffset.x;
    const index = Math.round(x / windowWidth);
    const current = randomPokemon[index];
    if (!current) return;
    const typeName = current?.types[0]?.type?.name;
    const color = colorsByType[typeName] ?? "#7619ec";
    setTabColor(color);
  };

  const onMomentumScrollEnd = (
    event: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    const x = event.nativeEvent.contentOffset.x;
    const index = Math.round(x / windowWidth);
    setActiveIndex(index);
    applyColorByIndex(index);
  };

  useEffect(() => {
    applyColorByIndex(0);
  }, [randomPokemon, windowWidth]);

  return (
    <Animated.ScrollView
      layout={LinearTransition}
      horizontal
      pagingEnabled
      snapToInterval={windowWidth}
      disableIntervalMomentum
      decelerationRate={"fast"}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      bounces={false}
      overScrollMode="never"
      scrollEventThrottle={16}
      onScroll={onMomentumScrollEnd}
      // onMomentumScrollEnd={onMomentumScrollEnd}
    >
      {randomPokemon.map((pokemon: Pokemon, index: number) => (
        <View
          key={index}
          style={[
            {
              // backgroundColor: colorsByType[pokemon.types[0].type.name] + 20,
              width: windowWidth,
              height: windowHeight,
            },
          ]}
        >
          {activeIndex === index ? (
            <Animated.View
              entering={FadeIn.duration(250)}
              exiting={FadeOut.duration(200)}
              style={{ flex: 1 }}
            >
              <SingleProduct pokemon={pokemon} />
            </Animated.View>
          ) : (
            <View style={{ flex: 1 }} />
          )}
          {/* <SingleProduct pokemon={pokemon} /> */}
        </View>
      ))}
    </Animated.ScrollView>
  );
};

const styles = StyleSheet.create({});

export default PagerView;
