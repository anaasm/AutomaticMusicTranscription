import pdf from '../download/YourMusicSheet.pdf';
import React from 'react';
import { Link } from 'react-router-dom';


export function getLink(){
return <Link to={pdf} className="btn btn-success btn-lg left" target="_blank" download style={{marginLeft:25}}>
    Click here to download your file!!
    </Link>;
}