export default function Denied() {
    return (
        <div style={{ height: "100vh" }} className="d-flex justify-content-center align-items-center">
            <div style={{ border: "2px solid black", borderRadius: "10px" }} className="p-5 text-center">
                <h1>Error 403: Forbidden</h1>
                <h5>We're sorry, but you do not have permission to access this resource. </h5>
            </div>
        </div>
    )
}