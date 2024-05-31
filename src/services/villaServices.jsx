/* eslint-disable prettier/prettier */
import { get, post, remove } from './request'

const Villas = (page, size, sort = true, fieldName = 'id', filter) => get(`/api/villas?sort=${fieldName}:${sort ? 'desc' : 'asc'}&filters[name][$containsi]=${filter}&pagination[page]=${page}&pagination[pageSize]=${size}`)
const GetVillaName = (id) => get(`/api/villas/${id}?fields=name`)
const GetVilla = (id) => get(`/api/villas/${id}?populate[photos][populate][0]=photo&populate[reservations][populate][reservation_infos][filters][owner]=true`)
const VillaAdd = (payload) => post('/api/villas', payload, true)
const VillaRemove = (id) => remove('/api/villas/' + id)





export { Villas, GetVillaName, GetVilla, VillaAdd, VillaRemove }