import React from 'react';
import Markdown from 'react-markdown';
import {format} from 'date-fns';

import './post.scss'

function extractMetaData(text: string): Array<any> {
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
    return [rawMetaData, metaData];
}

const MyPost: React.FC<{md: string}> = ({md}) => {
    const metadata = extractMetaData(md)[1];
    const post = md.replace(extractMetaData(md)[0]![0] + "\n", "");

    const date = format(new Date(metadata['date']), 'MMMM dd, yyyy');

    return(
        <>
            <div className='post'>
                <h1 className='fw-bold text-decoration-underline'>{metadata['title']}</h1>
                <p className='text-muted'>{date}</p>

                <Markdown className="post-body"
                components={{
                    h1: 'h2',
                    h2: 'h3',
                    h3: 'h4',
                }}>
                    {post}
                </Markdown>
            </div>
        </>
    );
}

export default MyPost;