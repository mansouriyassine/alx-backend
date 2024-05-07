#!/usr/bin/env python3
"""LFUCache module"""

from base_caching import BaseCaching


class LFUCache(BaseCaching):
    """LFUCache class"""

    def __init__(self):
        """Initialize"""
        super().__init__()
        self.usage_frequency = {}
        self.min_frequency = 0

    def put(self, key, item):
        """Add an item in the cache"""
        if key is not None and item is not None:
            if len(self.cache_data) >= self.MAX_ITEMS:
                if len(self.cache_data) == self.MAX_ITEMS:
                    lfu_keys = [
                        key for key, freq in self.usage_frequency.items()
                        if freq == self.min_frequency
                    ]
                    lru_key = min(
                        lfu_keys,
                        key=lambda k: self.usage_frequency[k]
                    )
                    del self.cache_data[lru_key]
                    del self.usage_frequency[lru_key]
                    print("DISCARD:", lru_key)
            self.cache_data[key] = item
            self.usage_frequency[key] = self.usage_frequency.get(key, 0) + 1
            self.min_frequency = min(self.usage_frequency.values())

    def get(self, key):
        """Get an item by key"""
        if key is not None and key in self.cache_data:
            self.usage_frequency[key] += 1
            self.min_frequency = min(self.usage_frequency.values())
            return self.cache_data[key]
        return None