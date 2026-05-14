import "./PageHeader.css";

function PageHeader({ breadcrumb, title, subtitle }) {
  return (
    <div className="pageHeader section">
      {breadcrumb ? <div className="breadcrumb">{breadcrumb}</div> : null}
      <h1 className="pageTitle">{title}</h1>
      {subtitle ? <p className="pageSubtitle">{subtitle}</p> : null}
      <hr className="pageDivider" />
    </div>
  );
}

export default PageHeader;
