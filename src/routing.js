import { useLocation } from 'react-router-dom';

export function GetQuery() {
    return new URLSearchParams(useLocation().search);
}