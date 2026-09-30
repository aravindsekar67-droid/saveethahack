package com.shieldpay.util;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class PrivacyMasker {

    private static final Pattern PHONE_PATTERN = Pattern.compile("(\\+?\\d{1,3}[-.\\s]?)?\\(?\\d{3}\\)?[-.\\s]?\\d{3}[-.\\s]?\\d{4}");
    private static final Pattern EMAIL_PATTERN = Pattern.compile("([a-zA-Z0-9_.+-]+)@([a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+)");
    private static final Pattern CARD_PATTERN = Pattern.compile("\\b(?:\\d[ -]*?){13,19}\\b");

    /**
     * Masks sensitive personally identifiable information (phone numbers, emails, cards).
     */
    public static String maskSensitiveData(String input) {
        if (input == null || input.isBlank()) {
            return input;
        }

        // Mask emails: j***n@domain.com
        Matcher emailMatcher = EMAIL_PATTERN.matcher(input);
        StringBuffer emailSb = new StringBuffer();
        while (emailMatcher.find()) {
            String user = emailMatcher.group(1);
            String domain = emailMatcher.group(2);
            String maskedUser;
            if (user.length() <= 2) {
                maskedUser = user.charAt(0) + "*";
            } else {
                maskedUser = user.charAt(0) + "***" + user.charAt(user.length() - 1);
            }
            emailMatcher.appendReplacement(emailSb, Matcher.quoteReplacement(maskedUser + "@" + domain));
        }
        emailMatcher.appendTail(emailSb);
        String step1 = emailSb.toString();

        // Mask phone numbers: +91 XXXXXXX210
        Matcher phoneMatcher = PHONE_PATTERN.matcher(step1);
        StringBuffer phoneSb = new StringBuffer();
        while (phoneMatcher.find()) {
            String fullPhone = phoneMatcher.group();
            String digitsOnly = fullPhone.replaceAll("\\D", "");
            String maskedPhone;
            if (digitsOnly.length() >= 7) {
                String prefix = fullPhone.startsWith("+") ? "+91 " : "";
                String last3 = digitsOnly.substring(digitsOnly.length() - 3);
                maskedPhone = prefix + "XXXXXXX" + last3;
            } else {
                maskedPhone = "XXXXXX";
            }
            phoneMatcher.appendReplacement(phoneSb, Matcher.quoteReplacement(maskedPhone));
        }
        phoneMatcher.appendTail(phoneSb);

        return phoneSb.toString();
    }

    /**
     * Masks a sender identifier (phone, email, or name).
     */
    public static String maskSender(String sender) {
        if (sender == null || sender.isBlank()) {
            return "Unknown";
        }
        return maskSensitiveData(sender);
    }
}
