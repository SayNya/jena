import React, {useEffect, useState} from "react";
import "./modal.css"
import {createEntity, getEntities, updateLabel} from "../../requests/axios";
import {getSortedEntities, getStrAfterHashtag} from "../../utils/utils";

export default function Modal({entity_name, prev_label, active, setActive, setEntities}) {
    const [label, setLabel] = useState("")

    async function handleUpdate(e) {
        e.preventDefault()
        try {
            await updateLabel(entity_name, prev_label, label)

            const res = await getEntities();
            const sortedEntities = getSortedEntities(res);
            setEntities(sortedEntities);
        } catch (error) {
            console.log(error);
        }

        setActive(false)
    }

    return (
        <div className={active ? "modal active" : "modal"} onClick={() => setActive(false)}>
            <div className={active ? "modal__content active" : "modal__content"} onClick={e => e.stopPropagation()}>
                <form onSubmit={handleUpdate}>
                    <label>{getStrAfterHashtag(entity_name)}</label>

                    <input id="input_style_id" className="input_style" type="text"
                           onChange={e => setLabel(e.target.value)}/>

                    <input className="submit_button" type="submit" value="Отправить"/>
                </form>
            </div>
        </div>
    )
}
