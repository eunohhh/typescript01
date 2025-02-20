import styles from "../../page.module.css"

export default function HelpLoader ({
    opacity, 
    embed, 
    embedMiddle
} : {
    opacity : number,
    embed : Boolean,
    embedMiddle : Boolean
}) {

    return(
        <>
            {embed === false && (
                <div style={{position:"relative", height:"100%", width: "100%", opacity: opacity}}>
                    <div className={styles.loadertext}><p>loading</p></div>
                    <div className={styles.loadercirclebox} style={{height: embedMiddle && "4.5rem"}}>
                        <div className={styles.loadercircle} >
                            <div></div><div></div><div></div><div></div>
                        </div>
                    </div>
                </div>
                )
            }
        </>
    )
}