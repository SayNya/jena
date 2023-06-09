import {Tab, TabList, TabPanel, Tabs} from "react-tabs";
import {useEffect, useState} from "react";
import {
    createEntity,
    getClasses,
    getEntities,
    getProperties,
    removeEntity,
    search1,
    search2,
    search3
} from "../requests/axios";
import {getSortedEntities, getStrAfterHashtag} from "../utils/utils";
import Modal from "./modal/modal";

export default function Table() {
    const [classes, setClasses] = useState()
    const [properties, setProperties] = useState()
    const [entities, setEntities] = useState()

    const [s1c1, setS1c1] = useState()
    const [s1c2, setS1c2] = useState()
    const [s1r, setS1r] = useState()

    const [s2c1, setS2c1] = useState()
    const [s2c2, setS2c2] = useState()
    const [s2r, setS2r] = useState()

    const [s3c1, setS3c1] = useState()
    const [s3c2, setS3c2] = useState()
    const [s3r, setS3r] = useState()

    const [entity_name, setEntityName] = useState()
    const [prevProperty, setPrevProperty] = useState()

    const [active, setActive] = useState()


    const [crEntityName, setCrEntityName] = useState()

    useEffect(() => {
        getClasses()
            .then(res => {
                res.sort((a, b) => {
                    let fa = a.label.value.toLowerCase(),
                        fb = b.label.value.toLowerCase();

                    if (fa < fb) {
                        return -1;
                    }
                    if (fa > fb) {
                        return 1;
                    }
                    return 0;
                });
                setClasses(res)
            })
        getEntities()
            .then(res => {
                console.log(getSortedEntities(res))
                setEntities(getSortedEntities(res))
            })
        getProperties()
            .then(res => {
                setProperties(res)
            })

    }, [])

    function handleCreate(classname) {
        return async function handleCreate(event) {
            event.preventDefault();
            try {
                await createEntity(crEntityName, classname); // дождаться завершения создания записи

                const res = await getEntities();
                const sortedEntities = getSortedEntities(res);
                setEntities(sortedEntities);
            } catch (error) {
                console.log(error);
            }
        }
    }

    function handleName(event) {
        setCrEntityName(event.target.value)
    }

    function handleS1c1(event) {
        setS1c1(event.target.value)
    }

    function handleS1c2(event) {
        setS1c2(event.target.value)
    }

    function handleS2c1(event) {
        setS2c1(event.target.value)
    }

    function handleS2c2(event) {
        setS2c2(event.target.value)
    }

    function handleS3c1(event) {
        setS3c1(event.target.value)
    }

    function handleS3c2(event) {
        setS3c2(event.target.value)
    }

    function handleChange(subject, properties) {
        return function (event) {
            if (properties) {
                properties.forEach(prop => {
                    if (prop.property === "http://www.w3.org/2000/01/rdf-schema#label") {
                        setPrevProperty(prop.value)
                    }
                })
            }
            setEntityName(subject)
            setActive(true)
            event.preventDefault()
        }
    }

    function handleRemove(entityURL) {
        return async function (event) {
            event.preventDefault();
            try {
                await removeEntity(entityURL);

                const res = await getEntities();
                const sortedEntities = getSortedEntities(res);
                setEntities(sortedEntities);
            } catch (error) {
                console.log(error);
            }
        }
    }

    function handleSearch(type) {
        if (type === 1) {
            return function (event) {
                search1(s1c1, s1c2)
                    .then(res => {
                        setS1r(res)
                    })
                event.preventDefault()
            }

        } else if (type === 2) {
            return function (event) {

                search2(s2c1, s2c2)
                    .then(res => {
                        setS2r(res)
                    })
                event.preventDefault()
            }

        } else {
            return function (event) {

                search3(s3c1, s3c2)
                    .then(res => {
                        setS3r(res)
                    })
                event.preventDefault()
            }

        }
    }

    return (
        <div className="main_wrap">
            <div className="tables">
                <Tabs forceRenderTabPanel defaultIndex={0}>
                    <TabList>
                        <Tab>Классы</Tab>
                        <Tab>Свойства</Tab>
                        <Tab>Экземпляры</Tab>
                    </TabList>
                    <TabPanel>
                        <table className="Main_table">

                            <tr className="Top_text_place">
                                <th className="Top_text">Class</th>
                                <th className="Top_text">SubClassOf</th>
                            </tr>
                            {classes ? classes.map(cls => {
                                if (cls.label === undefined) return
                                return (
                                    <tr className="Context_string">
                                        <td className="Context_box">{cls.label.value}</td>
                                        <td className="Context_box">{cls.subClassOf ? getStrAfterHashtag(cls.subClassOf.value) : "Не является подклассом"}</td>
                                    </tr>
                                )
                            }) : ""}
                        </table>
                    </TabPanel>
                    <TabPanel>
                        <table className="Main_table">
                            <tr className="Top_text_place">
                                <th className="Top_text">Property</th>
                                <th className="Top_text">Label</th>
                            </tr>
                            {properties ? properties.map(property => {
                                if (property.label === undefined) return
                                return (
                                    <tr className="Context_string">
                                        <td className="Context_box">{property.property.value}</td>
                                        <td className="Context_box">{property.label.value}</td>
                                    </tr>
                                )
                            }) : ""}
                        </table>
                    </TabPanel>
                    <TabPanel>
                        <Tabs forceRenderTabPanel defaultIndex={0}>
                            <TabList>
                                {classes ? classes.map(cls => {
                                    if (cls.label.value === "Направление" || cls.label.value === "Человек") return
                                    return <Tab>{cls.label.value}</Tab>
                                }) : ""}
                            </TabList>
                            {entities ? entities.map(ents => {
                                return (
                                    <TabPanel>
                                        <Tabs forceRenderTabPanel defaultIndex={0}>
                                            <TabList>
                                                {ents ? ents.map(entity => {
                                                    return <Tab>{getStrAfterHashtag(entity.subject)}</Tab>
                                                }) : ""}
                                            </TabList>
                                            {ents ? ents.map(entity => {
                                                return (
                                                    <TabPanel>
                                                        <table className="Main_table">
                                                            <tr className="Top_text_place">
                                                                <th className="Top_text">Property</th>
                                                                <th className="Top_text">Value</th>
                                                            </tr>
                                                            {entity ? entity.properties.map(property => {
                                                                return (
                                                                    <tr className="Context_string">
                                                                        <td className="Context_box">{getStrAfterHashtag(property.property)}</td>
                                                                        <td className="Context_box">{getStrAfterHashtag(property.value)}</td>
                                                                    </tr>

                                                                )
                                                            }) : ""}
                                                        </table>
                                                        <button
                                                            onClick={handleChange(entity.subject, entity.properties)}
                                                            className="change_lable">
                                                            Change Label
                                                        </button>
                                                        <button onClick={handleRemove(entity.subject)}
                                                                className="change_lable">
                                                            Remove Entity
                                                        </button>
                                                    </TabPanel>
                                                )
                                            }) : ""}
                                        </Tabs>
                                    </TabPanel>
                                )
                            }) : ""}

                            <TabPanel>
                                <table className="Main_table">
                                    <tr className="Top_text_place">
                                        <th className="Top_text">Instance</th>
                                        <th className="Top_text">Classname</th>
                                    </tr>
                                    {entities ? entities.map(entity => {
                                        if (entity.classname === undefined) return
                                        return (
                                            <tr className="Context_string">
                                                <td className="Context_box">{entity.instance.value}</td>
                                                <td className="Context_box">{entity.classname.value}</td>
                                            </tr>
                                        )
                                    }) : ""}
                                </table>
                            </TabPanel>

                        </Tabs>
                    </TabPanel>
                </Tabs>
            </div>
            <div className="forms">
                <Tabs forceRenderTabPanel defaultIndex={0}>
                    <TabList>
                        {classes ? classes.map(cls => {
                            if (cls.label === undefined) return
                            return (
                                <Tab>{cls.label.value}</Tab>
                            )
                        }) : ""}
                    </TabList>
                    {classes ? classes.map(cls => {
                        if (cls.label === undefined) return
                        return (
                            <div className="Form_place_wrap">
                                <TabPanel>

                                    <form onSubmit={handleCreate(cls.class.value)} className="Form_place">
                                        <label className="label_style_text" htmlFor="input_style_id">Название
                                            сущности:</label>

                                        <input id="input_style_id" className="input_style" type="text"
                                               value={crEntityName} onChange={handleName}/>

                                        <input className="submit_button" type="submit" value="Отправить"/>
                                    </form>

                                </TabPanel>
                            </div>

                        )
                    }) : ""}
                </Tabs>
            </div>
            <div className="search">
                <Tabs forceRenderTabPanel defaultIndex={0}>
                    <TabList>
                        <Tab>По двум Классам</Tab>
                        <Tab>По Классу и hasAuthor (or)</Tab>
                        <Tab>По Классу и hasAuthor (and)</Tab>
                    </TabList>
                    <div className="Form_place_wrap">
                        <TabPanel>
                            <form onSubmit={handleSearch(1)} className="Form_place_2">
                                <label className="label_style_text" htmlFor="input_style_id">Класс 1:</label>

                                <input id="input_style_id" className="input_style" type="text"
                                       value={s1c1} onChange={handleS1c1}/>
                                <label className="label_style_text" htmlFor="input_style_id">Класс 2:</label>

                                <input id="input_style_id" className="input_style" type="text"
                                       value={s1c2} onChange={handleS1c2}/>

                                <input className="submit_button" type="submit" value="Отправить"/>
                            </form>
                            <table className="Main_table_2">

                                <tr className="Top_text_place">
                                    <th className="Top_text">Class</th>
                                    <th className="Top_text">Label</th>
                                </tr>
                                {s1r ? s1r.map(entity => {
                                    if (entity.label === undefined) return
                                    return (
                                        <tr className="Context_string">
                                            <td className="Context_box">{entity.s.value}</td>
                                            <td className="Context_box">{entity.label.value}</td>
                                        </tr>
                                    )
                                }) : ""}
                            </table>
                        </TabPanel>
                        <TabPanel>
                            <form onSubmit={handleSearch(2)} className="Form_place_2">
                                <label className="label_style_text" htmlFor="input_style_id">Класс:</label>

                                <input id="input_style_id" className="input_style" type="text"
                                       value={s2c1} onChange={handleS2c1}/>
                                <label className="label_style_text" htmlFor="input_style_id">Автор:</label>

                                <input id="input_style_id" className="input_style" type="text"
                                       value={s2c2} onChange={handleS2c2}/>

                                <input className="submit_button" type="submit" value="Отправить"/>
                            </form>
                            <table className="Main_table_2">

                                <tr className="Top_text_place">
                                    <th className="Top_text">Class</th>
                                    <th className="Top_text">Label</th>
                                </tr>
                                {s2r ? s2r.map(entity => {
                                    if (entity.label === undefined) return
                                    return (
                                        <tr className="Context_string">
                                            <td className="Context_box">{entity.s.value}</td>
                                            <td className="Context_box">{entity.label.value}</td>
                                        </tr>
                                    )
                                }) : ""}
                            </table>
                        </TabPanel>
                        <TabPanel>
                            <form onSubmit={handleSearch(3)} className="Form_place_2">
                                <label className="label_style_text" htmlFor="input_style_id">Класс (ex.
                                    Живопись):</label>

                                <input id="input_style_id" className="input_style" type="text"
                                       value={s3c1} onChange={handleS3c1}/>
                                <label className="label_style_text" htmlFor="input_style_id">Автор (ex. Леонардо да
                                    Винчи):</label>

                                <input id="input_style_id" className="input_style" type="text"
                                       value={s3c2} onChange={handleS3c2}/>

                                <input className="submit_button" type="submit" value="Отправить"/>
                            </form>
                            <table className="Main_table_2">

                                <tr className="Top_text_place">
                                    <th className="Top_text">Class</th>
                                    <th className="Top_text">Label</th>
                                </tr>
                                {s3r ? s3r.map(entity => {
                                    if (entity.label === undefined) return
                                    return (
                                        <tr className="Context_string">
                                            <td className="Context_box">{entity.s.value}</td>
                                            <td className="Context_box">{entity.label.value}</td>
                                        </tr>
                                    )
                                }) : ""}
                            </table>
                        </TabPanel>
                    </div>
                </Tabs>
            </div>
            <Modal entity_name={entity_name} prev_label={prevProperty} active={active} setActive={setActive}
                   setEntities={setEntities}/>
        </div>

    )
}