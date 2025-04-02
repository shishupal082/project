# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20150806082008) do

  create_table "articles", force: :cascade do |t|
    t.string   "title",      limit: 255
    t.text     "text",       limit: 65535
    t.datetime "created_at",               null: false
    t.datetime "updated_at",               null: false
  end

  create_table "cities", force: :cascade do |t|
    t.integer "city_id",           limit: 4,                             null: false
    t.string  "city_name",         limit: 31,                            null: false
    t.string  "cc_number",         limit: 31
    t.string  "std_code",          limit: 15
    t.string  "tag_name",          limit: 127, default: "2014-11-11-v3"
    t.string  "city_display_name", limit: 127
  end

  add_index "cities", ["city_id", "city_name"], name: "city_id", unique: true, using: :btree
  add_index "cities", ["city_id"], name: "city_id_2", unique: true, using: :btree
  add_index "cities", ["city_id"], name: "city_id_3", unique: true, using: :btree
  add_index "cities", ["city_id"], name: "city_id_4", unique: true, using: :btree
  add_index "cities", ["city_name"], name: "city_name", unique: true, using: :btree
  add_index "cities", ["city_name"], name: "city_name_2", unique: true, using: :btree
  add_index "cities", ["city_name"], name: "city_name_3", unique: true, using: :btree
  add_index "cities", ["city_name"], name: "city_name_4", unique: true, using: :btree
  add_index "cities", ["city_name"], name: "city_name_5", unique: true, using: :btree

  create_table "cities_lat_lng", force: :cascade do |t|
    t.float  "ne_lat",    limit: 53
    t.float  "ne_lng",    limit: 53
    t.float  "sw_lat",    limit: 53
    t.float  "sw_lng",    limit: 53
    t.string "city_name", limit: 31, null: false
  end

  add_index "cities_lat_lng", ["city_name"], name: "city_name", unique: true, using: :btree

  create_table "developer_website_session", primary_key: "session_id", force: :cascade do |t|
    t.string   "ip_address",    limit: 16,    default: "0",   null: false
    t.string   "user_agent",    limit: 150
    t.integer  "last_activity", limit: 4,     default: 0
    t.text     "user_data",     limit: 65535,                 null: false
    t.boolean  "is_deleted",                  default: false, null: false
    t.datetime "created_at",                                  null: false
    t.datetime "updated_at",                                  null: false
  end

  create_table "links", force: :cascade do |t|
    t.string   "link",     limit: 255
    t.datetime "added_on"
    t.string   "category", limit: 255
  end

  create_table "offer_cities", force: :cascade do |t|
    t.integer "offer_id",  limit: 4,               null: false
    t.string  "city_name", limit: 255
    t.integer "is_active", limit: 4,   default: 1
  end

  add_index "offer_cities", ["offer_id"], name: "offer_id", unique: true, using: :btree

  create_table "offers", force: :cascade do |t|
    t.string   "city_name",       limit: 255
    t.datetime "expiry_date"
    t.datetime "updated_on",                                             null: false
    t.date     "created_on",                   default: '2014-10-17',    null: false
    t.string   "coupon_code",     limit: 31
    t.string   "applicable_on",   limit: 255
    t.string   "offer_text",      limit: 1023
    t.string   "image",           limit: 1023
    t.string   "offer_iframe",    limit: 1023
    t.string   "applicable_city", limit: 1023
    t.integer  "offer_id",        limit: 4
    t.string   "offer_name",      limit: 127
    t.string   "caption",         limit: 50
    t.string   "tag_name",        limit: 127,  default: "2014-11-28-v1"
    t.integer  "is_offer",        limit: 4,    default: 1
    t.string   "banner_image",    limit: 255
    t.string   "banner_link",     limit: 255
    t.integer  "is_banner",       limit: 4,    default: 0
    t.datetime "start_date",                                             null: false
  end

  create_table "pages", force: :cascade do |t|
    t.string   "html",     limit: 255
    t.string   "item_id",  limit: 127
    t.datetime "added_on"
    t.string   "js",       limit: 255
    t.string   "css",      limit: 255
  end

  create_table "pricing", force: :cascade do |t|
    t.string  "city_name",                 limit: 63,                            null: false
    t.string  "car_category",              limit: 63
    t.string  "car_display_name",          limit: 63
    t.string  "rate_type",                 limit: 31,  default: "flat_rate"
    t.string  "base_fare",                 limit: 15,  default: "0"
    t.string  "inclusive_of_km",           limit: 15,  default: "0"
    t.string  "rate_per_km",               limit: 15,  default: "0"
    t.string  "inclusive_of_wait_time",    limit: 15,  default: "0"
    t.string  "rate_per_wait_minute",      limit: 15,  default: "0"
    t.string  "inclusive_of_trip_minutes", limit: 15,  default: "0"
    t.string  "rate_per_trip_minute",      limit: 15,  default: "0"
    t.string  "tag_name",                  limit: 127, default: "2014-11-25-v1"
    t.string  "pickup_charge",             limit: 15,  default: "0"
    t.string  "pickup_charge_text",        limit: 127, default: ""
    t.integer "rate_card_index",           limit: 4,   default: 1
    t.integer "is_active",                 limit: 4,   default: 1
    t.integer "is_pickup_charge",          limit: 4,   default: 0
    t.integer "city_id",                   limit: 4,   default: 0,               null: false
    t.string  "city_display_name",         limit: 127, default: "",              null: false
    t.string  "rate_type_text",            limit: 63,  default: "FLAT RATE",     null: false
    t.boolean "serviceTaxInclusive",                   default: false
  end

  create_table "simple_captcha_data", force: :cascade do |t|
    t.string   "key",        limit: 40
    t.string   "value",      limit: 6
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "simple_captcha_data", ["key"], name: "idx_key", using: :btree

  create_table "songs", force: :cascade do |t|
    t.string   "song",        limit: 255
    t.string   "movie",       limit: 255
    t.datetime "added_on",                null: false
    t.datetime "modified_on",             null: false
    t.string   "item_id",     limit: 255
  end

  create_table "surcharge", force: :cascade do |t|
    t.string  "city_name",      limit: 63,                       null: false
    t.string  "car_category",   limit: 63, default: ""
    t.string  "rate_type",      limit: 63, default: "flat_rate"
    t.integer "applicable_day", limit: 4
    t.integer "start_min",      limit: 4
    t.integer "end_min",        limit: 4
    t.integer "amount",         limit: 4,  default: 0
  end

  create_table "terms_and_condition", force: :cascade do |t|
    t.integer "offer_id",     limit: 4,               null: false
    t.integer "line_number",  limit: 4,               null: false
    t.string  "t_and_c_text", limit: 511,             null: false
    t.integer "is_active",    limit: 4,   default: 1, null: false
  end

  create_table "users", force: :cascade do |t|
    t.string   "email",      limit: 127, null: false
    t.string   "mobile",     limit: 15,  null: false
    t.string   "name",       limit: 120
    t.datetime "created_at",             null: false
    t.datetime "updated_at",             null: false
  end

  add_index "users", ["email"], name: "email", unique: true, using: :btree
  add_index "users", ["mobile"], name: "mobile", unique: true, using: :btree

end
