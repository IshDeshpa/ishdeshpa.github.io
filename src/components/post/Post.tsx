import React from 'react';
import Markdown from 'react-markdown';
import {format} from 'date-fns';

import extractMetaData, { MDMetadata } from '../../utils/extractMD';

import './post.scss'

const MyPost: React.FC<{md: string}> = ({md}) => {
    const mdPostMetadata: MDMetadata = extractMetaData(md);

    const date = format(new Date(mdPostMetadata.metadata['date']), 'MMMM dd, yyyy');

    return(
        <>
            <div className='post p-2'>
                <h3 className='fw-bold text-decoration-underline'>{mdPostMetadata.metadata['title']}</h3>
                <p className='text-muted'>{date}</p>

                <div style={{ wordWrap: 'break-word' }}>
                    <Markdown className="post-body"
                    components={{
                        h1: 'h2',
                        h2: 'h3',
                        h3: 'h4',
                    }}>
                        {mdPostMetadata.markdown}
                    </Markdown>
                </div>
            </div>
        </>
    );
}

export default MyPost;