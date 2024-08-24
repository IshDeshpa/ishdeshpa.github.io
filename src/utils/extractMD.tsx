type MDMetadata = {
    metadata: {
        [key: string]: string;
    };
    markdown: string;
};

function extractMetaData(text: string): MDMetadata {
    const metaData = {} as any;

    const metaRegExp = RegExp(/^---[\r\n](((?!---).|[\r\n])*)[\r\n]---$/m);
    // get metadata
    const rawMetaData = metaRegExp.exec(text);

    let keyValues;

    if (rawMetaData!) {
        // rawMeta[1] are the stuff between "---"
        keyValues = rawMetaData[1].split("\n");

        // which returns a list of key values: ["key1: value", "key2: value"]
        keyValues.forEach((keyValue) => {
            // split each keyValue to keys and values
            const [key, value] = keyValue.split(":");
            metaData[key] = value.trim();
        });
    }
    
    return {
        metadata: metaData,
        markdown: text.replace(metaRegExp, ""),
    };
}

export type { MDMetadata };
export default extractMetaData;