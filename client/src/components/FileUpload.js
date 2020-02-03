import React, { Fragment, useState } from 'react';
import Message from "./Message";
import Progress from "./Progress";
import axios from 'axios';

const FileUpload = () => {
    const [file, setFile] = useState('');
    const [filename, setFilename] = useState('Choose file');
    const [uploadedFile, setUploadedFile] = useState({});
    const [message, setMessage] = useState('');
    const [uploadPercentage, setUploadPercentage] = useState(0);

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
                },
                onUploadProgress: progressEvent => {
                    setUploadPercentage(
                        parseInt(
                            Math.round((progressEvent.loaded*100)/progressEvent.total)
                        )
                    );


                    // Clear percentage
                    setTimeout(() => setUploadPercentage(0),10000);
                },
            });

            // Pull out fileName and filepath from res.data
            const { fileName, filePath } = res.data;

            // To nam stworzy this.state.uploadedFile.fileName oraz this.state.uploadedFile.filePath
            setUploadedFile({ fileName, filePath });

            setMessage('File Uploaded');
        } catch(err) {
            if (err.response.status === 500) {
                setMessage('There was a problem with the server');
            } else {
                setMessage(err.response.data.msg);
            }
        }
    };

    return (
        <Fragment>
            {message ? <Message msg={message}/> : null}
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
                <Progress percentage={uploadPercentage}/>
                <input
                    type="submit"
                    value="Upload"
                    className="btn btn-primary btn-block mt-4"
                />
            </form>
            {uploadedFile ?
                <div className="row mt-5">
                    <div className="col-md-6 m-auto">
                        <h3 className="text-center">
                            { uploadedFile.fileName }
                        </h3>
                        <img style={{ width: '100%'}} src={ uploadedFile.filePath } alt=""/>
                    </div>
                </div> : null
            }
        </Fragment>
    )
};

export default FileUpload;