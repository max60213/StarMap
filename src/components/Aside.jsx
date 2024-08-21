function Aside({ titles }) {
    return (
        <aside className="col-12 col-md-3 col-xl-2 sticky-top ps-4 ps-xl-5">
            <div id="navbar" className="h-100 flex-column align-items-stretch">
                <div className="nav flex-column border-start">
                    {titles.length > 0 && titles.map(title => (
                        <a key={title} className="nav-link" href={`#${title}`}>
                            {title}
                        </a>
                    ))}
                </div>
            </div>
        </aside>
    )
}

export default Aside