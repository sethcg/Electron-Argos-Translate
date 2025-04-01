def filter_unique(seq, extra):
    seen = set({extra, ""})
    seen_add = seen.add
    return [x for x in seq if not (x in seen or seen_add(x))]

def improve_translation_formatting(source, translation, improve_punctuation=True, remove_single_word_duplicates=True):
    source = source.strip()

    if not len(source):
        return ""

    if not len(translation):
        return source

    if improve_punctuation:
        source_last_char = source[len(source) - 1]
        translation_last_char = translation[len(translation) - 1]

        punctuation_chars = ['!', '?', '.', ',', ';', '。']
        if source_last_char in punctuation_chars:
            if translation_last_char != source_last_char:
                if translation_last_char in punctuation_chars:
                    translation = translation[:-1]

                translation += source_last_char
        elif translation_last_char in punctuation_chars:
            translation = translation[:-1]

    # A workaround for certain language models that output
    # the single word repeated ad-infinitum (the "salad" bug)
    # https://github.com/LibreTranslate/LibreTranslate/issues/46
    if remove_single_word_duplicates:
        if len(source) < 20 and source.count(" ") == 0 and translation.count(" ") > 0:
            bow = translation.split()
            count = {}
            for word in bow:
                count[word] = count.get(word, 0) + 1

            for word in count:
                if count[word] / len(count) >= 2:
                    translation = bow[0]
                    break

    if source.islower():
        return translation.lower()

    if source.isupper():
        return translation.upper()

    if len(translation) == 0:
        return source

    if source[0].islower():
        return translation[0].lower() + translation[1:]

    if source[0].isupper():
        return translation[0].upper() + translation[1:]

    return translation