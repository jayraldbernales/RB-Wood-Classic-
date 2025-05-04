export default function ContactInformationForm({ className = "" }) {
    return (
        <div
            className={`container py-4 ${className}`}
            style={{ maxWidth: "1200px" }}
        >
            <div className="card shadow-sm border-0 rounded-4">
                <div className="card-body p-4">
                    <h2 className="text-dark fw-bold border-bottom pb-3 mb-4 d-flex align-items-center">
                        <i className="bi bi-person-gear me-2 fs-3"></i> Get in
                        Touch
                    </h2>

                    <div className="row row-cols-1 row-cols-md-2 g-4">
                        <div className="d-flex align-items-start">
                            <i className="bi bi-telephone-fill me-3 fs-4 text-dark"></i>
                            <div>
                                <div className="fw-semibold">Phone</div>
                                <div className="fs-5">09947546757</div>
                            </div>
                        </div>

                        <div className="d-flex align-items-start">
                            <i className="bi bi-geo-alt-fill me-3 fs-4 text-dark"></i>
                            <div>
                                <div className="fw-semibold">Address</div>
                                <div className="fs-5">
                                    Purok 1, Cawayanan, Mabini, Bohol
                                </div>
                            </div>
                        </div>

                        <div className="d-flex align-items-start">
                            <i className="bi bi-envelope-fill me-3 fs-4 text-dark"></i>
                            <div>
                                <div className="fw-semibold">Email</div>
                                <div className="fs-5">
                                    bernalesj28@gmail.com
                                </div>
                            </div>
                        </div>

                        <div className="d-flex align-items-start">
                            <i className="bi bi-messenger me-3 fs-4 text-dark"></i>
                            <div>
                                <div className="fw-semibold">Messenger</div>
                                <a
                                    href="https://m.me/647746091735906"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="fs-5 text-secondary fw-bold text-decoration-underline"
                                >
                                    Chat via Messenger
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
