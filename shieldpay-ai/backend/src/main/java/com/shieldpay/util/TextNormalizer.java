package com.shieldpay.util;

import java.text.Normalizer;
import java.util.Locale;

public class TextNormalizer {

    public static String normalize(String text) {
        if (text == null) {
            return "";
        }
        // Normalize unicode accents
        String normalized = Normalizer.normalize(text, Normalizer.Form.NFD)
                .replaceAll("\\p{InCombiningDiacriticalMarks}+", "");

        // Lowercase
        normalized = normalized.toLowerCase(Locale.ENGLISH);

        // De-obfuscate common leet speak replacements
        normalized = normalized.replace("@", "a")
                .replace("0", "o")
                .replace("1", "i")
                .replace("3", "e")
                .replace("$", "s")
                .replace("!", "i");

        // Normalize multiple spaces and non-breaking spaces
        normalized = normalized.replaceAll("\\s+", " ").trim();

        return normalized;
    }
}
