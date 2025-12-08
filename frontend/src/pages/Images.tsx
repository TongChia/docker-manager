import {image} from "../../wailsjs/go/models";
import {useEffect, useState} from "preact/hooks";
import {h, Fragment} from 'preact';
import {ImageList} from "../../wailsjs/go/main/App";


export function Images(props: any) {
    const [images, setImages] = useState<Array<image.Summary>>([]);
    const updateImages = (list: Array<image.Summary>) => setImages(list);

    useEffect(() => {
        ImageList().then(updateImages);
    }, []);

    return (
        <>
            <div>
                <div>
                    {images.length === 0 ? (
                        <div>
                            <p>No containers found. Click "Fetch Containers" to load.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="table table-sm">
                                <thead>
                                <tr>
                                    <th>Id</th>
                                    <th>Tag</th>
                                </tr>
                                </thead>
                                <tbody>
                                {images.map((img) => (
                                    <tr key={img.Id}>
                                        <td>{img.Id}</td>
                                        <td>{img.RepoTags[0]}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}