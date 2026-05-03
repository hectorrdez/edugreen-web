export default class StringUtils {
  static JoinClassName(...strings: string[] | any[]) {
    return [...strings].join(" ").trim();
  }
}
