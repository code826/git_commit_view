import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { BasicInfo } from "./BasicInfo";

import { FileDiffArray } from "./FileDiffArray";
import { getBackendRootUrl } from "../Util";

const CommitPage = () => {

  const [basicInfo, setBasicInfo] = useState(null);
  const [diffData,setDiffData] =useState([]); 
  const [loadData,setLoadData] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDetails();
  }, []);

  const fetchDetails = async () => {
    const url = window.location.pathname;
    const match = url.match(/^\/repositories\/([^\/]+)\/([^\/]+)\/commits\/([^\/]+)$/);

    if (!match) {
      setLoadData(false);
      navigate("/info"); // Redirect to the info page if URL is incorrect
      return;
    }

    const [, owner, repo, commitId] = match;

    try {
      const a = `${getBackendRootUrl()}/repositories/${owner}/${repo}/commits/${commitId}/all`;
      const response = await fetch(`${getBackendRootUrl()}/repositories/${owner}/${repo}/commits/${commitId}/all`);
      if (!response.ok) throw new Error("Failed to fetch commit details");

      const data = await response.json();
      if(!data.success){
        throw new Error("Failed to fetch commit details");
      }
      setBasicInfo(data.data.basicDetails);
      setDiffData(data.data.diffDetails);
      setLoadData(true);
    } catch (error) {
      console.error("Error fetching commit details:", error);
      alert("error while fetching details go to console to see error");
      setLoadData(false);
     
    }
  };

  return (
    <div>
      {loadData ? (
       <>
            <BasicInfo basicInfo = {basicInfo}/>
            <FileDiffArray data={diffData} />
       </>
      ) : (
        <p>Loading failed. Or Error Occur</p>
      )}
    </div>
  );
};

export default CommitPage;
