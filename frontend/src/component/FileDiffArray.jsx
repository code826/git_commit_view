import FileDiff from "./FileDiff";

export const FileDiffArray = ({ data }) => {
  return (
    <div className="file-diff-container">
      {data.map((item, index) => (
        <div key={index} className="outer-block-file-diff">
          <FileDiff data={item} />
        </div>
      ))}
    </div>
  );
};
