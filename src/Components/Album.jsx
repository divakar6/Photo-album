import React from 'react';

const Album = ({ album, onDeletePhoto, onMovePhoto, otherAlbums }) => {

  return (
    <div>
      <h2 className="album-card-title">{album.name}</h2>
      <div className="photo-grid">
        {album.photos.map((photo, index) => {
          // Get the correct URL for display
          const photoUrl = typeof photo === 'object' && photo.url ? photo.url : photo;
          return (
            <div key={index} className="photo-item">
              <img src={photoUrl} alt={`Photo ${index}`} />
              <div className="photo-overlay">
                <button
                  onClick={() => onDeletePhoto(index)}
                  className="btn btn-danger"
                >
                  Delete
                </button>
                {otherAlbums.length > 0 && (
                  <select
                    onChange={(e) => onMovePhoto(index, e.target.value)}
                    className="photo-select"
                  >
                    <option value="">Move to...</option>
                    {otherAlbums.map((albumName) => (
                      <option key={albumName} value={albumName}>
                        {albumName}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Album;