// import { Pokemon } from "@/src/shared/types/pokemon.interface";
// import { View, Text, StyleSheet, Image } from "react-native";

// interface Props {
//   pokemon: Pokemon;
// }

// const SingleProduct = ({ pokemon }: Props) => {
//   return (
//     <View>
//       <Text style={styles.name}>{pokemon.name}</Text>
//       <Text style={styles.type}>{pokemon.types[0].type.name}</Text>

//       <View style={{ flexDirection: "row" }}>
//         <Image
//           source={{ uri: pokemon.image }}
//           style={{ width: 150, height: 150 }}
//         />
//         <Image
//           source={{ uri: pokemon.imageBack }}
//           style={{ width: 150, height: 150 }}
//         />
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   name: {
//     fontSize: 28,
//     fontWeight: "bold",
//     textAlign: "center",
//   },
//   type: {
//     fontSize: 20,
//     fontWeight: "bold",
//     color: "gray",
//     textAlign: "center",
//   },
// });

// export default SingleProduct;

import { Pokemon } from "@/src/shared/types/pokemon.interface";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTabTheme } from "@/src/shared/context/tab-theme-context";

interface Props {
  pokemon: Pokemon;
}

/** "BULBASAUR" / "bulbasaur" → "Bulbasaur"; "mr mime" → "Mr mime" */
function formatProductName(raw: string): string {
  return raw
    .trim()
    .split(/\s+/)
    .map((word, i) => {
      if (!word.length) return word;
      if (i === 0) {
        return word[0].toUpperCase() + word.slice(1).toLowerCase();
      }
      return word.toLowerCase();
    })
    .join(" ");
}

type ApiDetails = {
  height: number;
  weight: number;
  abilities: string[];
};

const CARD_SIZE = 280;

const SingleProduct = ({ pokemon }: Props) => {
  const displayName = useMemo(
    () => formatProductName(pokemon.name),
    [pokemon.name],
  );
  const { tabColor } = useTabTheme();
  const insets = useSafeAreaInsets();

  const [showBack, setShowBack] = useState(false);
  const flipAnim = useRef(new Animated.Value(0)).current;

  const [details, setDetails] = useState<ApiDetails | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(true);
  const [detailsError, setDetailsError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setDetailsLoading(true);
    setDetailsError(null);

    (async () => {
      try {
        const res = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(pokemon.name.toLowerCase())}`,
        );
        if (!res.ok) throw new Error("Failed to load");
        const data = await res.json();
        if (cancelled) return;
        setDetails({
          height: data.height,
          weight: data.weight,
          abilities: (data.abilities ?? [])
            .map((a: { ability?: { name?: string } }) => a.ability?.name)
            .filter(Boolean)
            .slice(0, 4) as string[],
        });
      } catch {
        if (!cancelled) setDetailsError("Could not load stats");
      } finally {
        if (!cancelled) setDetailsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [pokemon.name]);

  const primaryType = pokemon.types[0]?.type?.name ?? "unknown";

  const toggleFlip = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const next = !showBack;
    setShowBack(next);
    Animated.spring(flipAnim, {
      toValue: next ? 1 : 0,
      friction: 9,
      tension: 80,
      useNativeDriver: true,
    }).start();
  }, [flipAnim, showBack]);

  const frontAnimatedStyle = {
    opacity: flipAnim.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [1, 0, 0],
    }),
    transform: [
      {
        rotateY: flipAnim.interpolate({
          inputRange: [0, 1],
          outputRange: ["0deg", "180deg"],
        }),
      },
    ],
  };

  const backAnimatedStyle = {
    opacity: flipAnim.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0, 0, 1],
    }),
    transform: [
      {
        rotateY: flipAnim.interpolate({
          inputRange: [0, 1],
          outputRange: ["180deg", "360deg"],
        }),
      },
    ],
  };

  const fakePrice = useMemo(() => {
    const hash = pokemon.name
      .split("")
      .reduce((a, c) => a + c.charCodeAt(0), 0);
    return (9.99 + (hash % 50)).toFixed(2);
  }, [pokemon.name]);

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={{
        ...styles.scrollContent,
        paddingBottom: insets.bottom + 130,
      }}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.breadcrumb}>PokéMart / Plush / {displayName}</Text>

      <Text style={styles.title}>{displayName}</Text>
      <Text style={styles.subtitle}>
        Official-style plush • {primaryType} type
      </Text>

      <View style={styles.typeRow}>
        {pokemon.types.map((t) => (
          <View key={t.type.name} style={styles.typeChip}>
            <Text style={styles.typeChipText}>{t.type.name}</Text>
          </View>
        ))}
      </View>

      <Pressable onPress={toggleFlip} style={styles.imageCard}>
        <View style={styles.imageStage}>
          <Animated.View style={[styles.imageFace, frontAnimatedStyle]}>
            <Image
              source={{ uri: pokemon.image }}
              style={styles.sprite}
              contentFit="contain"
              transition={200}
            />
          </Animated.View>
          <Animated.View
            style={[styles.imageFace, styles.imageFaceBack, backAnimatedStyle]}
          >
            <Image
              source={{ uri: pokemon.imageBack || pokemon.image }}
              style={styles.sprite}
              contentFit="contain"
              transition={200}
            />
          </Animated.View>
        </View>
        <Text style={styles.tapHint}>
          <Ionicons name="sync" size={14} color="#6B7280" /> Tap to flip front /
          back
        </Text>
      </Pressable>

      <View style={styles.priceRow}>
        <Text style={styles.price}>${fakePrice}</Text>
        <Text style={styles.msrp}>${(Number(fakePrice) + 12).toFixed(2)}</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>SALE</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Details</Text>
        {detailsLoading && (
          <View style={styles.loaderRow}>
            <ActivityIndicator />
            <Text style={styles.muted}> Loading Pokédex data…</Text>
          </View>
        )}
        {detailsError && <Text style={styles.error}>{detailsError}</Text>}
        {!detailsLoading && details && (
          <>
            <Text style={styles.detailLine}>
              Height:{" "}
              <Text style={styles.detailStrong}>
                {(details.height / 10).toFixed(1)} m
              </Text>
            </Text>
            <Text style={styles.detailLine}>
              Weight:{" "}
              <Text style={styles.detailStrong}>
                {(details.weight / 10).toFixed(1)} kg
              </Text>
            </Text>
            {details.abilities.length > 0 && (
              <Text style={styles.detailLine}>
                Abilities:{" "}
                <Text style={styles.detailStrong}>
                  {details.abilities.join(", ")}
                </Text>
              </Text>
            )}
          </>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Shipping</Text>
        <Text style={styles.muted}>
          Free delivery over $35. Ships from Viridian City.
        </Text>
      </View>

      <Pressable
        style={({ pressed }) => [
          styles.cta,
          pressed && styles.ctaPressed,
          {
            borderWidth: 2,
            borderColor: tabColor,
            backgroundColor: "transparent",
          },
        ]}
        onPress={() => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }}
      >
        <Ionicons name="cart" size={22} color={tabColor} />
        <Text style={[styles.ctaText, { color: tabColor }]}>Add to cart</Text>
      </Pressable>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 25, paddingBottom: 32 },
  breadcrumb: { fontSize: 12, color: "#9CA3AF", marginBottom: 8 },
  title: { fontSize: 30, fontWeight: "800", color: "#111827" },
  subtitle: { fontSize: 15, color: "#6B7280", marginTop: 4 },
  typeRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 12 },
  typeChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "#F3F4F6",
  },
  typeChipText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
    textTransform: "capitalize",
  },
  imageCard: {
    marginTop: 20,
    alignSelf: "center",
    width: CARD_SIZE + 32,
  },
  imageStage: {
    width: CARD_SIZE,
    height: CARD_SIZE,
    alignSelf: "center",
    borderRadius: 24,
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    overflow: "hidden",
  },
  imageFace: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    backfaceVisibility: "hidden",
  },
  imageFaceBack: {
    // second face already rotated in animated style
  },
  sprite: { width: CARD_SIZE - 32, height: CARD_SIZE - 32 },
  tapHint: {
    textAlign: "center",
    marginTop: 10,
    fontSize: 13,
    color: "#6B7280",
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    gap: 10,
  },
  price: { fontSize: 28, fontWeight: "800", color: "#111827" },
  msrp: {
    fontSize: 16,
    color: "#9CA3AF",
    textDecorationLine: "line-through",
  },
  badge: {
    backgroundColor: "#FEE2E2",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: { color: "#B91C1C", fontWeight: "700", fontSize: 12 },
  section: { marginTop: 22 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },
  detailLine: { fontSize: 15, color: "#4B5563", marginBottom: 6 },
  detailStrong: { fontWeight: "700", color: "#111827" },
  muted: { fontSize: 14, color: "#6B7280" },
  error: { color: "#B91C1C", fontSize: 14 },
  loaderRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  cta: {
    marginTop: 28,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: "#111827",
    paddingVertical: 16,
    borderRadius: 16,
  },
  ctaPressed: { opacity: 0.9 },
  ctaText: { fontSize: 17, fontWeight: "bold" },
});

export default SingleProduct;
