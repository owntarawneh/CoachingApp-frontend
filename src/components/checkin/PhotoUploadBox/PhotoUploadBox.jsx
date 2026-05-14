import "./PhotoUploadBox.css";

function PhotoUploadBox({ label, value, onChange }) {
  function handleFile(e) {
    const file = e.target.files?.[0] ?? null;
    onChange(file);
  }

  const hasFile = Boolean(value);

  return (
    <div className="photoBox">
      <div className="photoLabel">{label}</div>

      <label className={`photoDrop ${hasFile ? "hasFile" : ""}`}>
        <input className="photoInput" type="file" accept="image/*" onChange={handleFile} />

        <div className="photoIcon">↑</div>
        <div className="photoText">
          {hasFile ? (
            <>
              <div className="photoFileName">{value.name}</div>
              <div className="photoHint">Click to change</div>
            </>
          ) : (
            <>
              <div>Drag files here</div>
              <div className="photoHint">or click to upload</div>
            </>
          )}
        </div>
      </label>
    </div>
  );
}

export default PhotoUploadBox;
