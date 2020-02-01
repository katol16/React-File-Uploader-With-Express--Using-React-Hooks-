import React, { Fragment, useState } from 'react';
import axios from 'axios';

const FileUpload = () => {
    const [file, setFile] = useState('');
    const [filename, setFilename] = useState('Choose file');
    // const [uploadedFile, setUploadedFile] = useState({});

    const onChange = e => {
        setFile(e.target.files[0]);
        setFilename(e.target.files[0].name);
    };

    const onSubmit = async e => {
        e.preventDefault();
        const formData = new FormData();
        // UWAGA!
        // Poniżej to peirwsze 'file' w cudzysłowie, odnosi się do file z server.js z lini 13 -> o to chodzi -> req.files.file;
        // Jeśli tutaj dasz formData.appen('image', file); to w sever.js mussiz mieć const file = req.files.image;
        formData.append('file', file);

        try {
            const res = await axios.post('/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            // const { fileName, filePath } = res.data;
            //
            // setUploadedFile({ fileName, filePath });
        } catch(err) {
            console.log(err);
        }
    };

    return (
        <Fragment>
            <form onSubmit={onSubmit}>
                <div className="custom-file mb-4">
                    <input
                        type="file"
                        className="custom-file-input"
                        id="customFile"
                        onChange={onChange}
                    />
                    <label
                        className="custom-file-label"
                        htmlFor="customFile"
                    >
                        {filename}
                    </label>
                </div>
                <input
                    type="submit"
                    value="Upload"
                    className="btn btn-primary btn-block"
                />
            </form>
        </Fragment>
    )
};

export default FileUpload;