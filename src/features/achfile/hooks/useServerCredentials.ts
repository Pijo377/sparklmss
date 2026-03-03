import { useState } from 'react';

export const useServerCredentials = () => {
    // Upload credentials
    const [uploadProtocol, setUploadProtocol] = useState('');
    const [uploadHostName, setUploadHostName] = useState('');
    const [uploadUserName, setUploadUserName] = useState('');
    const [uploadPassword, setUploadPassword] = useState('');
    const [uploadPortNo, setUploadPortNo] = useState('');
    const [uploadPath, setUploadPath] = useState('');

    // Download credentials
    const [downloadProtocol, setDownloadProtocol] = useState('');
    const [downloadHostName, setDownloadHostName] = useState('');
    const [downloadUserName, setDownloadUserName] = useState('');
    const [downloadPassword, setDownloadPassword] = useState('');
    const [downloadPortNo, setDownloadPortNo] = useState('');
    const [downloadPath, setDownloadPath] = useState('');

    const resetCredentials = () => {
        setUploadProtocol('');
        setUploadHostName('');
        setUploadUserName('');
        setUploadPassword('');
        setUploadPortNo('');
        setUploadPath('');
        setDownloadProtocol('');
        setDownloadHostName('');
        setDownloadUserName('');
        setDownloadPassword('');
        setDownloadPortNo('');
        setDownloadPath('');
    };

    return {
        uploadProtocol, setUploadProtocol,
        uploadHostName, setUploadHostName,
        uploadUserName, setUploadUserName,
        uploadPassword, setUploadPassword,
        uploadPortNo, setUploadPortNo,
        uploadPath, setUploadPath,
        downloadProtocol, setDownloadProtocol,
        downloadHostName, setDownloadHostName,
        downloadUserName, setDownloadUserName,
        downloadPassword, setDownloadPassword,
        downloadPortNo, setDownloadPortNo,
        downloadPath, setDownloadPath,
        resetCredentials,
    };
};
