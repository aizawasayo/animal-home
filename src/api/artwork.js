import request from '@/utils/request'

export function getArtworkList(params) {
  return request({
    url: 'admin/artwork',
    method: 'get',
    params
  })
}

export function getArtwork(id) {
  return request({
    url: 'admin/artwork/' + id,
    method: 'get'
  })
}

export function searchArtwork(name) {
  return request({
    url: 'admin/artwork/search',
    method: 'get',
    params: {
      name
    }
  })
}