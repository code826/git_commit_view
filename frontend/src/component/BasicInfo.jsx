import { convertIntoDays } from "../Util";

export const BasicInfo = (props) => {
    const { oid, subject, message, author, committer, parents } = props.basicInfo;

    return (
        <div className="outer-block">
            {/* Left Section */}
            <div className="left-block width-70">
                <div className="content">
                    {/* Avatar */}
                    <img className="avatar" src={author.avatar_url} alt="No-image" />

                    {/* Commit Info */}
                    <div className="commit-details">
                        <span className="header">{subject}</span>
                        <div className="info-line">
                            <strong className="label">Author By:</strong> <span className="value">{author.name || ""} {convertIntoDays(author.date || null)}</span>
                        </div>
                        <span>{message}</span>
                    </div>
                </div>
            </div>

            {/* Right Section */}
            <div className="right-block width-30">
                {author.email !== committer.email && (
                    <div className="info-line">
                        <strong className="label">Commited By:</strong> <span className="value">{committer.name} {convertIntoDays(committer.date || null)}</span> 
                    </div>
                )}

                {/* Commit ID */}
                <div className="info-line">
                    <strong className="label">Commit:</strong> <span className="value">{oid}</span>
                </div>

                {/* Parent Commit ID */}
                <div className="info-line">
                    <strong className="label">Parent:</strong> <span className="value">{parents[0].oid}</span>
                </div>
            </div>
        </div>
    );
};
