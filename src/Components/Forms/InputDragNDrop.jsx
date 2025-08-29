import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

export function InputDragNDrop() {
    
    const onDrop = useCallback(files => {
        // TODO: do something with the files
    }, []);

    const [isDragActive] = useDropzone({onDrop});
}