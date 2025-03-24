import { useState } from "react";
import "../FileDiff.css"; // Assuming CSS is in the same directory

const Line = ({ content, type, baseLineNumber, headLineNumber }) => {
    return (
      <div className={`line ${type.toLowerCase()}`}>
        <span className="line-number">{baseLineNumber ?? "-"}</span>
        <span className="line-number">{headLineNumber ?? "-"}</span>
        <span className="symbol">{type === "ADDED" ? "+" : type === "DELETED" ? "-" : " "}</span>
        <span className="content">{content}</span>
      </div>
    );
  };

const Hunk = ({ header, lines }) => (
  <div className="hunk">
    <div className="hunk-header">{header}</div>
    <div className="hunk-content">
      {lines.map((line, index) => (
        <Line key={index} content={line.content} type={line.type} baseLineNumber={line.baseLineNumber} headLineNumber ={line.headLineNumber} />
      ))}
    </div>
  </div>
);

const FileDiff = ({ data }) => {
  const [visible, setVisible] = useState(true);

  return (
    <div className="file-diff">
      <div className="file-header" onClick={() => setVisible(!visible)}>
        {">"} <span className="color-link">{data.baseFile.path}</span> {visible ? "▼" : "▶"}
      </div>
      {visible && (
        <div className="file-content">
          {data.hunks.map((hunk, index) => (
            <Hunk key={index} header={hunk.header} lines={hunk.lines} />
          ))}
        </div>
      )}
    </div>
  );
};


export default FileDiff;
