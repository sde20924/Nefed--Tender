import React from "react";
import style from "../../pages/css/buyers.module.css";
const DocumentViews = ({ documents, className }) => {
  //View Button
  const viewDocument = (url) => {
    window.open(url, "_blank");
  };

  return (
    <div className={className}>
      <h3>Documents</h3>
      <div className={style.document_list}>
        {documents.userDocuments.map((ele, idx) => {
          return (
            <div key={idx + 1} className={style.document_item}>
              <label>{ele.doc_name}</label>
              <button onClick={() => viewDocument(ele.doc_url)}>View</button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DocumentViews;
