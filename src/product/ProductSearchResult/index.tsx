import Taro, { Component } from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'

import SearchBox from './components/SearchBox'
import SearchFilters from './components/SearchFilters'
import SearchList from './components/SearchList'
import HotList from '../../pages/index/components/HotList'
import SearchWrap from './components/SearchWarp'

import './index.less'
import classNames from 'classnames';
import axios from 'taro-axios';
import { data } from './mock/test'
import LoadMore from '../../components/LoadMore'

const sizeList = ["35.5", "36", "36.5", "37", "37.5", "38", "38.5", "39", "39.5", "40", "40.5", "41", "41.5", "42", "42.5", "43", "43.5", "44", "44.5", "45", "45.5", "46", "46.5", "47", "47.5", "48", "48.5", "全部"]

const toggleFilterPriceUp = (filterPriceUp: FilterPriceUp): FilterPriceUp => {
  switch (filterPriceUp) {
    case -1: return 0;
    case 0: return 1;
    case 1: return 0
  }
}

export type SortType = "soldNum" | "price" | "sellDate" | "size"
export type FilterPriceUp = -1 | 0 | 1
export type SearchFilterTap = (sortType: SortType) => void
type SearchWord = {
  id: number;
  word: string;
  highlight: string;
}

export type ResultItem = {
  id: number;
  price: number;
  soldNum: number;
  title: string;
  indexImage: string;
}

interface ProductSearchResultProps { }
export interface ProductSearchResultState {
  sortType: SortType;
  selectSize: boolean;
  selectSizeString: string;
  filterPriceUp: FilterPriceUp;
  searchWordList: SearchWord[];
  resultList: ResultItem[];
  page: number
  hasMore: boolean
  loading: boolean
}

const findProductsByKeyword = (state) => {
  const { sortType, filterPriceUp, page } = state
  axios.get(
    'http://localhost:8080/product/search',
    {
      params: {
        // 页数目前写死
        pageNum: page,
        // keyword先写死
        keyword: 'Jordan',
        selectSizing: '全部',
        sortType,
        isDescending: filterPriceUp === 0 ? false : true
      }
    }
  )
    .then(resp => {
      const { list, nextPage, hasNextPage } = resp.data.data
      this.setState({
        resultList: list,
        page: nextPage,
        hasMore: hasNextPage
      })
    })
    .catch(err => {
      console.log(err);
    })
}


export default class ProductSearchResult extends Component<ProductSearchResultProps, ProductSearchResultState> {

  state: ProductSearchResultState = {
    sortType: "soldNum",
    selectSize: false,
    selectSizeString: '全部',
    filterPriceUp: -1,
    searchWordList: [],
    resultList: [],
    page: 1,
    hasMore: true,
    loading: false
  }

  searchFilterTap = (sortType: SortType) => {
    let { selectSize, filterPriceUp } = this.state
    sortType === "soldNum" && (filterPriceUp = -1)
    sortType === "price" && (filterPriceUp = toggleFilterPriceUp(filterPriceUp))
    sortType === "sellDate" && (filterPriceUp = -1)
    if (sortType === "size") {
      this.setState({ selectSize: !selectSize })
      return
    }
    // sortType ==="size" && (selectSize = !selectSize) && (return)
    console.log(filterPriceUp);
    this.setState({ sortType, selectSize, filterPriceUp, page: 1, hasMore: true })
  }

  selectSizeTap = (selectSizeString: string) => {
    let { selectSize } = this.state
    selectSize = !selectSize
    this.setState({ selectSizeString, selectSize })
  }

  loadMore = () => {
    console.log("触发了loadMore方法");
    const { sortType, filterPriceUp, page, hasMore, resultList: preList } = this.state
    if (!hasMore) { return }
    this.setState({ loading: true })
    axios.get(
      'http://localhost:8080/product/search', {
      params: {
        // 页数目前写死
        pageNum: page,
        // keyword先写死
        keyword: 'Jordan',
        selectSizing: '全部',
        sortType,
        isDescending: filterPriceUp === 0 ? false : true
      }
    }
    )
      .then(resp => {
        const { list, nextPage, hasNextPage } = resp.data.data
        setTimeout(() => {
          this.setState({
            resultList: preList.concat(list),
            page: nextPage,
            hasMore: hasNextPage,
            loading: false
          })
        }, 1000)
      })
      .catch(err => {
        console.log(err);
        setTimeout(() => { this.setState({ loading: false }) }, 1000)
      })

  }


  updateResultList = (word) => {
    console.log("word", word);
    const { sortType, filterPriceUp, page } = this.state
    axios.get(
      'http://localhost:8080/product/search', {
      params: {
        // 页数目前写死
        pageNum: page,
        // keyword先写死
        keyword: 'Jordan',
        selectSizing: '全部',
        sortType,
        isDescending: filterPriceUp === 0 ? false : true
      }
    }
    )
      .then(resp => {
        const { list, nextPage, hasNextPage } = resp.data.data
        this.setState({
          resultList: list,
          page: nextPage,
          hasMore: hasNextPage
        })
      })
      .catch(err => {
        console.log(err);
      })
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (
      prevState.selectSizeString !== this.state.selectSizeString
      || prevState.sortType !== this.state.sortType
      || prevState.filterPriceUp !== this.state.filterPriceUp
      || prevState.selectSizeString !== this.state.selectSizeString
    ) {
      const { sortType, filterPriceUp, page } = this.state
      axios.get(
        'http://localhost:8080/product/search', {
        params: {
          // 页数目前写死
          pageNum: page,
          // keyword先写死
          keyword: 'Jordan',
          selectSizing: '全部',
          sortType,
          isDescending: filterPriceUp === 0 ? false : true
        }
      }
      )
        .then(resp => {
          this.setState({ resultList: resp.data.data.list })
        })
        .catch(err => {
          console.log(err);
        })
    }
  }

  render() {
    const { selectSizeString, selectSize, resultList, loading, hasMore } = this.state
    // const { searchWordList } = this.state

    // 实时显示匹配的搜索关键字
    // const { list: searchWordList } = data

    // console.log(searchWordList);
    return (
      <View className='max-height'>
        <SearchBox updateResultList={this.updateResultList} />
        {/* <SearchWrap /> */}

        {/*
          searchWordList.map(item => {
            // console.log('')
            return (
              <View className="search-list" >
                <View className="list-cell">{item.word}</View>
                <View className="list-line"></View>
              </View>
            )
          })
        */}

        <SearchFilters
          searchFilterTap={this.searchFilterTap}
          selectSize={this.state.selectSize}
          selectSizeString={selectSizeString}
          sortType={this.state.sortType}
          filterPriceUp={this.state.filterPriceUp}
        />
        {
          selectSize &&
          <View className='bg_screen'>
            <View className='size-pop-view'>
              {
                sizeList.map((item: string) => {
                  const isSelect = item === selectSizeString
                  return (
                    <View key={item} className='size-flex-view'>
                      <View
                        className={classNames('size-item', { 'size-item-select': isSelect })}
                        onClick={this.selectSizeTap.bind(this, item)}
                      >
                        {item}
                      </View>
                    </View>
                  )
                })
              }
            </View>
          </View>
        }
        {/* <View style={{ marginTop: '178rpx' }}></View> */}
        <ScrollView
          scrollY
          className='scroll-view'
          onScrollToLower={this.loadMore}
        >
          <HotList list={resultList} />
          {/* <SearchList />  */}
          <LoadMore
            hasMore={hasMore}
            loading={loading}
          />
        </ScrollView>

      </View>
    )
  }
}
