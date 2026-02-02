import {Dispatch, StateUpdater, useEffect, useState} from "preact/hooks";


export const useLocalStorage = <S>(key: string, initValue: S): [S, Dispatch<StateUpdater<S>>] => {
    const persist = localStorage.getItem(key)
    const revert = persist ? JSON.parse(persist) : null
    const [state, setState] = useState<S>(revert || initValue)

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(state))
    }, [state]);

    return [state, setState]
}