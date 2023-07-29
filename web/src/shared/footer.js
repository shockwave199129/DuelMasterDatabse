export default function Footers() {
    return (
        <>
            <footer id="footer">
                <div className="container footer-bottom clearfix">
                    <div className="copyright">
                        &copy; Copyright <strong><span>{new Date().getFullYear()}, made with <i className="bi bi-heart-fill" style={{"color":"#eb5e28", "animation":"heathing 1s ease infinite"}}></i></span></strong> All Rights Reserved
                    </div>
                    <div className="credits">
                        Made by <a href="https://github.com/shockwave199129" target="_blank">Subhrangshu</a>
                    </div>
                </div>
            </footer>
        </>
    )
}