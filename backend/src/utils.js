import axios from "axios";
import { ApplicationError } from "./ApplicationError.js";

const GITHUB_ROOT_URL = "https://api.github.com";

export async function  getInformationByCommitId(owner,repo,oid,dataExposure=0){
    try {
        const response = await axios.get(`${GITHUB_ROOT_URL}/repos/${owner}/${repo}/commits/${oid}`, {
            headers: { "User-Agent": "commit-viewer" }, // GitHub API requires a User-Agent header
        });
        //only require basic details
        if(dataExposure == 1){
            return getTheBasicDetailsFromCommitResponse(response.data);
        }
        if(dataExposure == 2){
            return getCommitDiffDetails(response.data)
        }
        return {
            basicDetails:getTheBasicDetailsFromCommitResponse(response.data),
            diffDetails:getCommitDiffDetails(response.data)
        }
        // return response.data; // Send the commit data as JSON response
    } catch (error) {
            console.log("Error",error);
            throw new ApplicationError(error,error.statusCode || 500);
    }

}

export const isValidSHA = (oid) => /^[a-fA-F0-9]{40}$/.test(oid);

export const getTheBasicDetailsFromCommitResponse = (data) => {
    if (!data || typeof data !== "object") {
      return null; // Return null if data is missing or not an object
    }
  
    return {
      oid: data.sha || null,
      subject: data.commit?.message?.split("\n")[0] || null, // First line of commit message
      message: data.commit?.message?.split("\n").slice(1).join("\n") || null, // Remaining lines
      author: {
        name: data.commit?.author?.name || null,
        date: data.commit?.author?.date || null,
        email: data.commit?.author?.email || null,
        avatar_url: data.author?.avatar_url || null, // Avatar comes from 'author' field, not 'commit.author'
      },
      committer: {
        name: data.commit?.committer?.name || null,
        date: data.commit?.committer?.date || null,
        email: data.commit?.committer?.email || null,
        avatar_url: data.committer?.avatar_url || null, // Avatar comes from 'committer' field
      },
      parents: data.parents?.map((parent) => ({
        oid: parent.sha || null,
      })) || [],
    };
};
  

function safeGet(obj, path, defaultValue = null) {
    if (!obj) return defaultValue;
    
    const keys = path.split('.');
    let result = obj;
    
    for (const key of keys) {
        if (result === null || result === undefined) return defaultValue;
        result = result[key];
    }
    
    return result !== undefined ? result : defaultValue;
}


function parseGitHubCommitFiles(files) {
    // Handle null or empty input
    if (!files || !Array.isArray(files)) {
        console.warn('Invalid input: files must be a non-null array');
        return [];
    }

    return files.map(file => {
        // Safely extract file information with defaults
        const changeKind = safeGet(file, 'status', 'UNKNOWN').toUpperCase();
        const filename = safeGet(file, 'filename', 'unknown_file');
        const fileSha = safeGet(file, 'sha', null);
        const blobUrl = safeGet(file, 'blob_url', '');

        // Parse stats with defaults
        const stats = {
            additions: safeGet(file, 'additions', 0),
            deletions: safeGet(file, 'deletions', 0),
            totalChanges: safeGet(file, 'changes', 0)
        };

        // Parse patch only for non-empty patches
        const parsedHunks = changeKind !== 'DELETED' && file.patch 
            ? safeParsePatch(file.patch) 
            : [];

        return {
            changeKind,
            headFile: {
                path: filename,
                sha: fileSha
            },
            baseFile: {
                path: safeGet(file, 'previous_filename', filename),
                sha: blobUrl ? blobUrl.split('/').pop() : null
            },
            stats,
            hunks: parsedHunks
        };
    });
}


function safeParsePatch(patch) {
    // Validate input
    if (!patch || typeof patch !== 'string') {
        console.warn('Invalid patch: must be a non-empty string');
        return [];
    }

    const hunks = [];
    const lines = patch.split('\n');
    
    let currentHunk = null;
    
    try {
        lines.forEach(line => {
            // Check for hunk header
            const hunkHeaderMatch = line.match(/^@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@/);
            
            if (hunkHeaderMatch) {
                // Start a new hunk if header is found
                if (currentHunk) {
                    hunks.push(currentHunk);
                }
                
                currentHunk = {
                    header: line,
                    baseStartLine: parseInt(hunkHeaderMatch[1] || 1),
                    baseLineCount: parseInt(hunkHeaderMatch[2] || 1),
                    headStartLine: parseInt(hunkHeaderMatch[3] || 1),
                    headLineCount: parseInt(hunkHeaderMatch[4] || 1),
                    lines: []
                };
            } else if (currentHunk) {
                // Process line changes within a hunk
                let lineChange = { 
                    content: line,
                    type: 'UNCHANGED'
                };
                
                if (line.startsWith('-')) {
                    // Deleted line
                    lineChange.type = 'DELETED';
                    lineChange.baseLineNumber = currentHunk.baseStartLine + 
                        currentHunk.lines.filter(l => l.type !== 'ADDED').length;
                } else if (line.startsWith('+')) {
                    // Added line
                    lineChange.type = 'ADDED';
                    lineChange.headLineNumber = currentHunk.headStartLine + 
                        currentHunk.lines.filter(l => l.type !== 'DELETED').length;
                } else if (line.startsWith(' ')) {
                    // Unchanged line
                    lineChange.baseLineNumber = currentHunk.baseStartLine + 
                        currentHunk.lines.filter(l => l.type !== 'ADDED').length;
                    lineChange.headLineNumber = currentHunk.headStartLine + 
                        currentHunk.lines.filter(l => l.type !== 'DELETED').length;
                }
                
                // Remove the +/-/space marker from the content
                lineChange.content = line.slice(1);
                
                currentHunk.lines.push(lineChange);
            }
        });
        
        // Add the last hunk
        if (currentHunk) {
            hunks.push(currentHunk);
        }
    } catch (error) {
        console.error('Error parsing patch:', error);
        return [];
    }
    
    return hunks;
}


function getCommitDiffDetails(data){
    return processCommitFiles(data.files || []);
}
function processCommitFiles(files) {
    try {
        // Validate input
        if (!files) {
            return [];
        }

        // Parse files
        const parsedFiles = parseGitHubCommitFiles(files);

        // Additional validation if needed
        if (parsedFiles.length === 0) {
            console.warn('No files were parsed successfully');
        }

        return parsedFiles;
    } catch (error) {
        console.error('Error processing commit files:', error);
        return [];
    }
}

