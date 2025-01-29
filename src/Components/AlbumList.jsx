import React, { useState } from 'react';
import Album from './Album';

const AlbumList = () => {
  const [albums, setAlbums] = useState([]);
  const [newAlbumName, setNewAlbumName] = useState('');
  const [selectedAlbum, setSelectedAlbum] = useState(null);

  const createAlbum = (e) => {
    e.preventDefault();
    if (newAlbumName.trim()) {
      setAlbums([...albums, { name: newAlbumName.trim(), photos: [] }]);
      setNewAlbumName('');
    }
  };

  const deleteAlbum = (index) => {
    setAlbums(albums.filter((_, i) => i !== index));
    if (selectedAlbum === index) setSelectedAlbum(null);
  };

  const addPhotos = (e, albumIndex) => {
    const files = Array.from(e.target.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    const filePromises = imageFiles.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(filePromises).then(photos => {
      const updatedAlbums = [...albums];
      updatedAlbums[albumIndex].photos.push(...photos);
      setAlbums(updatedAlbums);
    });
  };

  const deletePhoto = (photoIndex) => {
    const updatedAlbums = [...albums];
    updatedAlbums[selectedAlbum].photos = updatedAlbums[selectedAlbum].photos.filter(
      (_, i) => i !== photoIndex
    );
    setAlbums(updatedAlbums);
  };

  const movePhoto = (photoIndex, targetAlbumName) => {
    const updatedAlbums = [...albums];
    const photo = updatedAlbums[selectedAlbum].photos[photoIndex];
    const targetAlbumIndex = updatedAlbums.findIndex(
      album => album.name === targetAlbumName
    );

    updatedAlbums[targetAlbumIndex].photos.push(photo);
    updatedAlbums[selectedAlbum].photos = updatedAlbums[selectedAlbum].photos.filter(
      (_, i) => i !== photoIndex
    );
    setAlbums(updatedAlbums);
  };

  return (
    <div className="container">
      <form onSubmit={createAlbum} className="album-form">
        <input
          type="text"
          value={newAlbumName}
          onChange={(e) => setNewAlbumName(e.target.value)}
          placeholder="New Album Name"
          className="album-input"
        />
        <button type="submit" className="btn btn-primary">
          Create Album
        </button>
      </form>
      <br />
      <div className="album-grid">
        {albums.map((album, index) => (
          <div key={index} className="album-card">
            <div className="album-card-header">
              <h3 className="album-card-title">{album.name}</h3>
              <button
                onClick={() => deleteAlbum(index)}
                className="btn btn-danger"
              >
                Delete Album
              </button>
            </div>
            <div className="album-actions">
              <button
                onClick={() => setSelectedAlbum(index)}
                className="btn btn-secondary"
              >
                View Album
              </button>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => addPhotos(e, index)}
                className="file-input"
                id={`photo-input-${index}`}
              />
              <label
                htmlFor={`photo-input-${index}`}
                className="btn btn-success file-label"
              >
                Add Photos
              </label>
            </div>
          </div>
        ))}
      </div>
      <br />

      {selectedAlbum !== null && albums[selectedAlbum] && (
        <div>
          <button
            onClick={() => setSelectedAlbum(null)}
            className="back-button"
          >
            ← Back to Albums
          </button>
          <Album
            album={albums[selectedAlbum]}
            onDeletePhoto={deletePhoto}
            onMovePhoto={movePhoto}
            otherAlbums={albums
              .filter((_, index) => index !== selectedAlbum)
              .map(album => album.name)}
          />
        </div>
      )}
    </div>
  );
};

export default AlbumList;